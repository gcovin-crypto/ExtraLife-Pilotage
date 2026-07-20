// imap-test.js — diagnostic de la releve Gmail (lecture seule).
// Extrait du serveur d'origine, reserve aux administrateurs.

module.exports = async function imapTest(_req, res) {
  const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const page = (inner) => `<!doctype html><meta charset=utf8><title>Diagnostic Gmail</title>
    <style>body{font:15px/1.6 system-ui;max-width:760px;margin:40px auto;padding:0 16px;color:#0f172a}
    h1{font-size:20px} .ok{color:#059669} .ko{color:#dc2626} .card{border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin:10px 0}
    code{background:#f1f5f9;padding:1px 5px;border-radius:4px}</style>
    <h1>Diagnostic de la relève Gmail</h1>${inner}`;
  const host = process.env.IMAP_HOST, user = process.env.IMAP_USER, pass = process.env.IMAP_PASS;
  if (!host || !user || !pass)
    return res.send(page(`<p class=ko>Configuration incomplète : il manque IMAP_HOST, IMAP_USER ou IMAP_PASS.</p>`));
  const { ImapFlow } = require('imapflow');
  const { simpleParser } = require('mailparser');
  const { leadFromEmail, extractFields } = require('./ingest-email');
  const mailbox = process.env.IMAP_MAILBOX || 'INBOX';
  const filter = process.env.IMAP_SUBJECT_FILTER || '';
  const client = new ImapFlow({ host, port: +(process.env.IMAP_PORT || 993), secure: true, auth: { user, pass }, logger: false });
  try {
    await client.connect();
    const lock = await client.getMailboxLock(mailbox);
    let rows = '', total = 0, shown = 0;
    try {
      total = (client.mailbox && client.mailbox.exists) || 0;
      const from = Math.max(1, total - 8 + 1);
      for await (const msg of client.fetch(total ? `${from}:*` : '1:*', { source: true })) {
        shown++;
        const parsed = await simpleParser(msg.source);
        const subj = parsed.subject || '(sans objet)';
        const matchFilter = !filter || subj.toLowerCase().includes(filter.toLowerCase());
        const fields = extractFields(parsed);
        const norm = k => k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
        const findVal = frag => { for (const k of Object.keys(fields)) if (norm(k).includes(frag)) return fields[k]; return null; };
        const cp = findVal('codepostal') || findVal('postal');
        const nb = findVal('nombredepersonnes') || findVal('candidats') || findVal('participants');
        const lead = leadFromEmail(parsed);
        let verdict, detail = `<br><small style="color:#64748b">code postal détecté : ${cp ? esc(cp) : '<i>aucun</i>'} · nombre : ${nb ? esc(nb) : '<i>aucun</i>'}</small>`;
        if (!matchFilter) verdict = `<span class=ko>ignoré : l'objet ne contient pas « ${esc(filter)} »</span>`;
        else if (lead) verdict = `<span class=ok>OK → département ${lead.dept}, ${lead.candidats} pers. (${lead.isGroup ? 'groupe' : 'individuel'})</span>`;
        else verdict = `<span class=ko>non exploitable (pas de code postal français valide, ou demande étrangère)</span>`;
        if (!lead && matchFilter) {
          const flat = ((parsed.text || (parsed.html || parsed.textAsHtml || '').replace(/<[^>]+>/g, ' ')) || '').replace(/\s+/g, ' ').trim().slice(0, 240);
          detail += `<br><small style="color:#94a3b8">extrait : ${esc(flat)}…</small>`;
        }
        rows += `<div class=card><b>${esc(subj)}</b><br>${verdict}${detail}</div>`;
      }
    } finally { lock.release(); }
    await client.logout();
    const head = `<p class=ok>Connexion à ${esc(host)} réussie (compte ${esc(user)}).</p>
      <p>Boîte <code>${esc(mailbox)}</code> — <b>${total}</b> message(s) au total ; aperçu des <b>${shown}</b> plus récents (lus ou non).
      Filtre d'objet : ${filter ? `<code>${esc(filter)}</code>` : '<i>aucun (tous les mails)</i>'}.</p>`;
    res.send(page(head + (rows || '<p>Aucun message récent à analyser dans ce dossier.</p>')));
  } catch (e) {
    res.send(page(`<p class=ko>Échec de connexion : ${esc(e.message)}</p>
      <p>Causes fréquentes : mot de passe d'application incorrect, ou validation en deux étapes non activée.</p>`));
  }
};
