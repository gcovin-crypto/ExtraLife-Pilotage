// routes-digiforma.js — synchronisation lecture seule depuis Digiforma.
//
//   GET  /api/digiforma/diagnostic     état de la connexion et champs découverts (admin)
//   POST /api/digiforma/sync           récupère les sessions et les met en cache
//   GET  /api/digiforma/rapprochement  compare Digiforma et la plateforme
//   POST /api/digiforma/appliquer      reprend des valeurs choisies, champ par champ
//
// Aucune écriture n'est envoyée à Digiforma. Aucune valeur n'est reprise
// automatiquement : la plateforme signale, l'utilisateur décide.

const express = require('express');
const { db } = require('./db');
const A = require('./db-app');
const D = require('./digiforma');
const { rapprocher, CHAMPS } = require('./reconcile');

db.exec(`
  CREATE TABLE IF NOT EXISTS digiforma_sessions (
    digiforma_id TEXT PRIMARY KEY,
    data         TEXT NOT NULL,
    synced_at    TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS digiforma_sync (
    id         INTEGER PRIMARY KEY CHECK (id = 1),
    last_at    TEXT,
    last_by    TEXT,
    count      INTEGER,
    status     TEXT,
    message    TEXT
  );
`);

const router = express.Router();

const requireAuth = (req, res, next) =>
  req.user ? next() : res.status(401).json({ error: 'non_authentifie' });
const requireRole = (...roles) => (req, res, next) =>
  !req.user ? res.status(401).json({ error: 'non_authentifie' })
    : roles.includes(req.user.role) ? next()
      : res.status(403).json({ error: 'droits_insuffisants' });

/* ------------------------------------------------------------ stockage */

function enregistrerSessions(liste) {
  db.exec('BEGIN');
  try {
    const st = db.prepare(`
      INSERT INTO digiforma_sessions (digiforma_id, data, synced_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(digiforma_id) DO UPDATE SET data = excluded.data, synced_at = excluded.synced_at
    `);
    liste.forEach((s) => st.run(s.digiformaId, JSON.stringify(s)));
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
}

const sessionsEnCache = () =>
  db.prepare('SELECT data FROM digiforma_sessions').all()
    .map((r) => { try { return JSON.parse(r.data); } catch { return null; } })
    .filter(Boolean);

function noterSync(status, message, count, who) {
  db.prepare(`
    INSERT INTO digiforma_sync (id, last_at, last_by, count, status, message)
    VALUES (1, datetime('now'), ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET last_at = datetime('now'), last_by = excluded.last_by,
      count = excluded.count, status = excluded.status, message = excluded.message
  `).run(who || null, count || 0, status, message || null);
}

const dernierSync = () =>
  db.prepare('SELECT last_at, last_by, count, status, message FROM digiforma_sync WHERE id = 1').get() || null;

/* ------------------------------------------- sessions locales comparables */

// Extrait de l'état de pilotage les sessions dans une forme comparable.
function sessionsLocales() {
  const s = A.getState();
  if (!s.data) return { liste: [], etat: null, version: 0 };
  let etat;
  try { etat = JSON.parse(s.data); } catch { return { liste: [], etat: null, version: s.version }; }
  const liste = (etat.factures || []).filter((f) => !f.annulee).map((f) => ({
    id: f.id, date: f.date, client: f.client || '', formateur: f.formateur || '',
    montantHT: f.montantHT, coutVar: f.coutVar, cFormateur: f.cFormateur,
    nbParticipants: f.nbParticipants, placesMax: f.placesMax, heures: f.heures,
    satisfaction: f.satisfaction, formationId: f.formationId, origine: f.origine,
  }));
  return { liste, etat, version: s.version };
}

/* ---------------------------------------------------------- diagnostic */

router.get('/api/digiforma/diagnostic', requireRole('admin'), async (req, res) => {
  const esc = (t) => String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const page = (corps) => `<!doctype html><meta charset="utf-8">
    <title>Diagnostic Digiforma</title>
    <div style="font:15px/1.65 system-ui,-apple-system,sans-serif;max-width:860px;margin:48px auto;padding:0 22px;color:#101828">
    <h2 style="margin:0 0 22px">Diagnostic de la connexion Digiforma</h2>${corps}</div>`;
  const ko = (t) => `<p style="background:#fef3f2;border:1px solid #fecdca;color:#b42318;padding:11px 14px;border-radius:9px">${t}</p>`;
  const ok = (t) => `<p style="color:#027a48;font-weight:600">${t}</p>`;

  if (!process.env.DIGIFORMA_TOKEN)
    return res.type('html').send(page(ko(
      'La variable <code>DIGIFORMA_TOKEN</code> n\'est pas renseignée. ' +
      'Générez un token depuis Digiforma (Paramètres → Interconnexions → GraphQL) ' +
      'puis ajoutez-le dans les variables de la plateforme.')));

  try {
    const schema = await D.decouvrirSchema();
    const types = Object.keys(schema);
    if (!types.length)
      return res.type('html').send(page(ko('Connexion établie mais aucun type découvert. Le token a-t-il les droits de lecture ?')));

    const tableau = types.map((t) => {
      const champs = Object.keys(schema[t]);
      return `<tr><td style="padding:7px 10px;border-bottom:1px solid #eef0f4"><code>${esc(t)}</code></td>
        <td style="padding:7px 10px;border-bottom:1px solid #eef0f4;font-size:12.5px;color:#475467">
        ${esc(champs.join(', '))}</td></tr>`;
    }).join('');

    let apercu = '';
    try {
      const d = await D.gql(D.construireRequete(schema), { pagination: { page: 0, perPage: 3 } });
      const brut = (d && d.trainingSessions) || [];
      apercu = `<h3 style="margin-top:30px">Aperçu de ${brut.length} session(s)</h3>` +
        brut.map((s) => {
          const n = D.normaliser(s);
          const l = (k, v) => `<div style="display:flex;justify-content:space-between;font-size:13px;padding:1px 0">
            <span style="color:#667085">${k}</span><b>${esc(v == null ? '—' : v)}</b></div>`;
          return `<div style="border:1px solid #e6e9ee;border-radius:11px;padding:13px 15px;margin-bottom:10px">
            <div style="font-weight:700;margin-bottom:6px">${esc(n.nom || n.code || n.digiformaId)}</div>
            ${l('Date', n.date)}${l('Programme', n.programme)}${l('Client', n.client)}
            ${l('Formateur', n.formateur)}${l('Apprenants', n.nbParticipants)}
            ${l('Durée (h)', n.heures)}${l('CA HT', n.montantHT)}${l('Coût direct', n.coutVar)}
            ${l('Satisfaction', n.satisfaction)}${l('État', n.etat)}</div>`;
        }).join('');
      if (!brut.length) apercu += '<p style="color:#667085">Aucune session retournée par Digiforma.</p>';
    } catch (e) {
      apercu = ko(`La requête de session a échoué : ${esc(e.message)}`);
    }

    res.type('html').send(page(
      ok(`Connexion réussie à ${esc(D.ENDPOINT)}.`) +
      `<h3 style="margin-top:26px">Champs réellement disponibles</h3>
       <p style="color:#667085;font-size:13px">Le connecteur n'utilise que ces champs. Si Digiforma en ajoute, ils seront pris en compte automatiquement.</p>
       <table style="width:100%;border-collapse:collapse;font-size:13px">${tableau}</table>` + apercu));
  } catch (e) {
    res.type('html').send(page(ko(`Échec : ${esc(e.message)}`) +
      `<p style="color:#667085;font-size:13px">Codes fréquents : <code>authentification</code> si le token est refusé, ` +
      `<code>reseau</code> si Digiforma est injoignable.</p>`));
  }
});

/* -------------------------------------------------------- synchronisation */

let syncEnCours = false;

router.post('/api/digiforma/sync', requireRole('admin', 'editeur'), async (req, res) => {
  if (syncEnCours) return res.status(409).json({ error: 'sync_en_cours' });
  syncEnCours = true;
  try {
    const { sessions } = await D.recupererSessions({ max: 3000 });
    const normalisees = sessions.map(D.normaliser);
    enregistrerSessions(normalisees);
    noterSync('ok', null, normalisees.length, `${req.user.nom}`);
    res.json({ ok: true, recuperees: normalisees.length, sync: dernierSync() });
  } catch (e) {
    noterSync('erreur', e.message, 0, `${req.user.nom}`);
    res.status(502).json({ error: e.message === 'token_absent' ? 'token_absent' : 'echec_sync', message: e.message });
  } finally { syncEnCours = false; }
});

router.get('/api/digiforma/etat', requireAuth, (_req, res) => {
  res.json({
    configure: !!process.env.DIGIFORMA_TOKEN,
    enCache: db.prepare('SELECT COUNT(*) AS n FROM digiforma_sessions').get().n,
    sync: dernierSync(),
  });
});

/* --------------------------------------------------------- rapprochement */

router.get('/api/digiforma/rapprochement', requireAuth, (_req, res) => {
  const { liste } = sessionsLocales();
  const distants = sessionsEnCache();
  const r = rapprocher(liste, distants);
  res.json({
    ...r,
    champs: CHAMPS.map((c) => ({ cle: c.loc, label: c.label, type: c.type })),
    sync: dernierSync(),
  });
});

/* --------------------------------------------------- reprise de valeurs */

// Reprend explicitement certaines valeurs Digiforma dans des sessions locales.
// Corps attendu : { reprises: [ { localId, champs: ["placesMax","heures"] } ] }
router.post('/api/digiforma/appliquer', requireRole('admin', 'editeur'), (req, res) => {
  const reprises = (req.body && req.body.reprises) || [];
  if (!Array.isArray(reprises) || !reprises.length)
    return res.status(400).json({ error: 'rien_a_appliquer' });

  const s = A.getState();
  if (!s.data) return res.status(409).json({ error: 'etat_absent' });
  let etat;
  try { etat = JSON.parse(s.data); } catch { return res.status(500).json({ error: 'etat_illisible' }); }

  const { liste } = sessionsLocales();
  const r = rapprocher(liste, sessionsEnCache());
  const parLocal = new Map(r.paires.map((p) => [String(p.localId), p]));
  const autorises = new Set(CHAMPS.map((c) => c.loc));

  let modifs = 0;
  const detail = [];
  etat.factures = (etat.factures || []).map((f) => {
    const demande = reprises.find((x) => String(x.localId) === String(f.id));
    if (!demande) return f;
    const paire = parLocal.get(String(f.id));
    if (!paire) return f;
    const copie = { ...f };
    (demande.champs || []).forEach((cle) => {
      if (!autorises.has(cle)) return;
      const c = CHAMPS.find((x) => x.loc === cle);
      const v = paire.distant[c.dist];
      if (v === null || v === undefined || v === '') return;
      copie[cle] = v;
      modifs++;
      detail.push({ localId: f.id, champ: cle, valeur: v });
    });
    copie.digiformaId = paire.digiformaId;
    return copie;
  });

  if (!modifs) return res.json({ ok: true, modifs: 0 });

  const qui = `${req.user.nom} (reprise Digiforma : ${modifs} valeur${modifs > 1 ? 's' : ''})`;
  const w = A.saveState(JSON.stringify(etat), s.version, qui);
  if (!w.ok) return res.status(409).json({ error: 'conflit_de_version',
    message: 'Les données ont changé entre-temps. Rechargez la page et réessayez.' });
  res.json({ ok: true, modifs, detail, version: w.version });
});

module.exports = { router };
