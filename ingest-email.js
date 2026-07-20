// ingest-email.js — relève des e-mails de demande via IMAP et ingestion.
// Peut tourner seul (`node ingest-email.js`) OU être démarré par le serveur
// (INGEST_IN_PROCESS=true), pour un déploiement en un seul service.

require('dotenv').config();
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const { normalizeLead } = require('./parse');
const db = require('./db');

function cfg() {
  return {
    host: process.env.IMAP_HOST,
    port: +(process.env.IMAP_PORT || 993),
    secure: (process.env.IMAP_SECURE || 'true') === 'true',
    auth: { user: process.env.IMAP_USER, pass: process.env.IMAP_PASS },
    mailbox: process.env.IMAP_MAILBOX || 'INBOX',
    subjectFilter: process.env.IMAP_SUBJECT_FILTER || '',
    pollMs: +(process.env.IMAP_POLL_MS || 120000),
  };
}

function htmlToText(html) {
  return String(html)
    .replace(/<\/(td|th)>/gi, '\t')
    .replace(/<\/(tr|p|div|li|h\d)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
    .replace(/&#39;|&rsquo;|&apos;/gi, "'").replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
}

// Reconstruit les paires libellé -> valeur d'un e-mail de demande.
// Tolérant : gère "libellé : valeur" sur la même ligne (texte ou tableau HTML)
// ET le cas où la valeur est sur la LIGNE SUIVANTE (mise en page en colonnes).
function extractFields(parsed) {
  const text = parsed.text || htmlToText(parsed.html || parsed.textAsHtml || '');
  const flat = text.replace(/\s+/g, ' ').trim();
  // Lecture ANCRÉE sur les libellés : chaque valeur = ce qui se trouve entre son
  // libellé et le libellé suivant (robuste même quand tout est collé sans espace).
  const STOPS = "pr[\u00e9\u00e8]nom\\s*:|nom\\s*soci[\u00e9\u00e8]t[\u00e9\u00e8]|(?<!pr[\u00e9\u00e8])nom\\s*:|code\\s*postal|t[\u00e9\u00e8]l[\u00e9\u00e8]phone|t[\u00e9\u00e8]l\\s*:|e[- ]?mail\\s*:|ville|quelle\\s+formation|vous\\s+[\u00ea e]tes|nombre\\s+de\\s+personnes|souhaitez[- ]?vous|avez[- ]?vous|o[u\u00f9]\\s+souhaitez|pr[\u00e9\u00e8]cisez|derni[\u00e8e]re\\s+[\u00e9\u00e8]tape|vos\\s+informations|accept[\u00e9\u00e8]|merci|$";
  const grab = (labelPat) => {
    const m = flat.match(new RegExp("(?:" + labelPat + ")\\s*(.*?)\\s*(?:" + STOPS + ")", "i"));
    return m && m[1] ? m[1].trim() : null;
  };
  const fields = {};
  const set = (k, v) => { if (v) fields[k] = v; };
  set('Formation',           grab("quelle\\s+formation\\s+recherchez[- ]?vous\\s*\\?"));
  set('Nombre de personnes', grab("nombre\\s+de\\s+personnes\\s+[\u00e0a]\\s+former\\s*\\?"));
  set('Code postal',         grab("code\\s*postal\\s*:"));
  set('Pr\u00e9nom',            grab("pr[\u00e9\u00e8]nom\\s*:"));
  set('Nom',                 grab("(?<!pr[\u00e9\u00e8])nom\\s*:"));
  set('Structure',           grab("nom\\s*soci[\u00e9\u00e8]t[\u00e9\u00e8]\\s*:|soci[\u00e9\u00e8]t[\u00e9\u00e8]\\s*:|organisme\\s*:|structure\\s*:|[\u00e9\u00e8]tablissement\\s*:"));
  return fields;
}

function leadFromEmail(parsed) {
  const fields = extractFields(parsed);
  fields.submissionId = parsed.messageId;
  if (parsed.date) fields.date = parsed.date.toISOString();
  return normalizeLead(fields);
}

// Combien de messages récents examiner à chaque passage (bornage léger).
const RECENT_WINDOW = +(process.env.IMAP_RECENT || 80);

// Une relève = une connexion neuve + examen des messages RÉCENTS (lus ou non),
// la déduplication empêchant les doublons. On ne touche pas au statut lu/non-lu.
async function pollOnce(c, onInsert) {
  const client = new ImapFlow({ host: c.host, port: c.port, secure: c.secure, auth: c.auth, logger: false });
  await client.connect();
  const lock = await client.getMailboxLock(c.mailbox);
  try {
    const total = (client.mailbox && client.mailbox.exists) || 0;
    if (!total) { console.log('[imap] relève : boîte vide'); return 0; }
    const from = Math.max(1, total - RECENT_WINDOW + 1);
    const leads = [];
    let scanned = 0;
    for await (const msg of client.fetch(`${from}:*`, { source: true })) {
      scanned++;
      const parsed = await simpleParser(msg.source);
      const subj = parsed.subject || '';
      if (c.subjectFilter && !subj.toLowerCase().includes(c.subjectFilter.toLowerCase())) continue;
      const lead = leadFromEmail(parsed);
      if (lead) leads.push(lead);
    }
    const inserted = db.insertMany(leads);            // dédup -> seules les nouvelles s'ajoutent
    console.log(`[imap] relève : ${scanned} récent(s) examiné(s), ${leads.length} demande(s), ${inserted} nouvelle(s)`);
    if (inserted && onInsert) onInsert(inserted);
    return inserted;
  } finally {
    lock.release();
    await client.logout().catch(() => {});
  }
}

// Démarre la relève en continu. onInsert(n) est appelé quand de nouveaux leads entrent.
async function startEmailIngestion(onInsert) {
  const c = cfg();
  if (!c.host || !c.auth.user || !c.auth.pass) {
    console.log('[imap] non configuré (IMAP_HOST/USER/PASS) - releve e-mail desactivee.');
    return;
  }
  console.log(`[imap] relève e-mail active sur ${c.host} (reconnexion à chaque passage, toutes les ${c.pollMs / 1000}s)`);
  const loop = async () => { try { await pollOnce(c, onInsert); } catch (e) { console.error('[imap]', e.message); } };
  await loop();
  setInterval(loop, c.pollMs);
}

// Relit TOUT le dossier (lus + non lus), sans rien marquer, pour compléter nom/structure
// sur les demandes déjà en base. Opération ponctuelle, potentiellement longue.
async function backfillAll(onProgress) {
  const c = cfg();
  if (!c.host || !c.auth.user || !c.auth.pass) { console.log('[backfill] IMAP non configuré.'); return; }
  const client = new ImapFlow({ host: c.host, port: c.port, secure: c.secure, auth: c.auth, logger: false });
  await client.connect();
  const lock = await client.getMailboxLock(c.mailbox);
  let seen = 0, updated = 0, batch = [];
  try {
    console.log('[backfill] démarrage sur', c.mailbox);
    for await (const msg of client.fetch({ seq: '1:*' }, { source: true })) {
      seen++;
      const parsed = await simpleParser(msg.source);
      const subj = parsed.subject || '';
      if (c.subjectFilter && !subj.toLowerCase().includes(c.subjectFilter.toLowerCase())) continue;
      const lead = leadFromEmail(parsed);
      if (lead) batch.push(lead);
      if (batch.length >= 200) { updated += db.insertMany(batch); batch = []; console.log(`[backfill] ${seen} lus…`); if (onProgress) onProgress(); }
    }
    if (batch.length) { updated += db.insertMany(batch); if (onProgress) onProgress(); }
    console.log(`[backfill] terminé : ${seen} mails parcourus, base complétée.`);
  } finally {
    lock.release();
    await client.logout().catch(() => {});
  }
}

module.exports = { startEmailIngestion, leadFromEmail, extractFields, backfillAll };

if (require.main === module) {
  startEmailIngestion().catch(e => { console.error(e); process.exit(1); });
}
