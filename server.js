// server.js — plateforme unifiée ExtraLife Formation.
//
//   /                     application de pilotage (React, servie depuis dist/)
//   /carte                carte de France des demandes (accès authentifié)
//   /api/auth/*           connexion, déconnexion, mot de passe
//   /api/state            état partagé : prospects, factures, dépenses, paramètres
//   /api/leads            demandes LonaSanté + transformation en prospect
//   /api/stats            agrégats de la carte
//   /api/webhook/lead     réception d'un lead depuis le formulaire (public, secret)
//   /api/health           état du service (public)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { normalizeLead, buildStats } = require('./parse');
const db = require('./db');
const A = require('./db-app');
const { router: appRouter, attachUser, requireAuth, bootstrap } = require('./routes-app');

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const LEAD_COST = +(process.env.LEAD_COST || 24);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(attachUser);

/* ------------------------------ amorçage : historique des demandes + état */

function seedIfEmpty() {
  if (db.count() > 0) return;
  const seedPath = path.join(__dirname, 'seed.json');
  if (!fs.existsSync(seedPath)) return;
  try {
    const n = db.insertMany(JSON.parse(fs.readFileSync(seedPath, 'utf8')));
    console.log(`Historique chargé : ${n} demandes importées depuis seed.json`);
  } catch (e) { console.error('seed.json illisible :', e.message); }
}
seedIfEmpty();
bootstrap();
A.purgeExpiredSessions();

/* ----------------------------------------------------- cache des agrégats */

let cache = { at: 0, payload: null };
function getStats() {
  const now = Date.now();
  if (cache.payload && now - cache.at < 10_000) return cache.payload;
  const payload = buildStats(db.allLeads());
  payload.totalLeads = db.count();
  payload.leadCost = LEAD_COST;
  cache = { at: now, payload };
  return payload;
}
function invalidate() { cache = { at: 0, payload: null }; }

/* ---------------------------------------------------------- routes libres */

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, leads: db.count(), version: A.getState().version, time: new Date().toISOString() }));

app.post('/api/webhook/lead', (req, res) => {
  if (WEBHOOK_SECRET) {
    const got = req.get('x-webhook-secret') || req.query.secret;
    if (got !== WEBHOOK_SECRET) return res.status(401).json({ error: 'unauthorized' });
  }
  const items = Array.isArray(req.body) ? req.body : [req.body];
  const normalized = items.map(x => normalizeLead(x)).filter(Boolean);
  if (!normalized.length)
    return res.status(422).json({ error: 'no_usable_lead', hint: 'champs attendus : formation, candidats, code_postal (ou departement), date' });
  const inserted = db.insertMany(normalized);
  invalidate();
  res.json({ received: items.length, accepted: normalized.length, inserted, duplicates: normalized.length - inserted });
});

/* ------------------------------------------- authentification, état, leads */

app.use(appRouter);
app.use(require('./routes-digiforma').router);

/* ----------------------------------------------- routes carte (protégées) */

app.get('/api/stats', requireAuth, (_req, res) => {
  try { res.json(getStats()); }
  catch (e) { console.error(e); res.status(500).json({ error: 'stats_failed' }); }
});

app.post('/api/lead/status', requireAuth, (req, res) => {
  const { id, status, price } = req.body || {};
  if (!id || !['open', 'gagne', 'perdu'].includes(status))
    return res.status(400).json({ error: 'bad_request', hint: 'id + status (open|gagne|perdu)' });
  const p = status === 'gagne' ? (price == null ? null : Number(price)) : null;
  const ok = db.setStatus(id, status, p);
  invalidate();
  res.json({ ok, id, status, price: p });
});

// Complète les noms sur les demandes déjà en base (relecture du dossier Gmail).
let backfilling = false;
app.get('/api/reingest', requireAuth, (_req, res) => {
  if ((process.env.INGEST_IN_PROCESS || '') !== 'true')
    return res.status(400).send('Ingestion e-mail non activée.');
  if (backfilling) return res.send('Complétion déjà en cours — voir les logs.');
  backfilling = true;
  require('./ingest-email').backfillAll(() => { invalidate(); })
    .catch(e => console.error('[backfill]', e.message))
    .finally(() => { backfilling = false; });
  res.send('Complétion des noms démarrée. Suivez la progression dans les logs, puis rechargez la carte.');
});

// Diagnostic Gmail — réservé aux administrateurs (il affiche le contenu des mails).
app.get('/api/imap-test', (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).send('Accès réservé aux administrateurs.');
  next();
}, require('./imap-test'));

/* ------------------------------------------------- pages (carte puis SPA) */

const gatePage = (req, res, next) => {
  if (!req.user) return res.redirect('/');
  next();
};
app.get('/carte', gatePage, (_req, res) => res.sendFile(path.join(__dirname, 'public-carte', 'index.html')));
app.use('/carte', gatePage, express.static(path.join(__dirname, 'public-carte')));

const DIST = path.join(__dirname, 'dist');
app.use(express.static(DIST));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ExtraLife Formation — pilotage sur http://localhost:${PORT}`);
  console.log(`  • ${db.count()} demandes en base · ${A.countUsers()} compte(s) · état v${A.getState().version}`);
});

if ((process.env.INGEST_IN_PROCESS || '') === 'true') {
  require('./ingest-email').startEmailIngestion(() => invalidate())
    .catch(e => console.error('[imap]', e.message));
}
