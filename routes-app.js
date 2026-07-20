// routes-app.js — authentification, état de pilotage partagé, gestion des comptes
// et transformation d'une demande LonaSanté en prospect du pipeline CRM.

const express = require('express');
const fs = require('fs');
const path = require('path');
const A = require('./db-app');

const COOKIE = 'els_session';
const isProd = process.env.NODE_ENV === 'production' || !!process.env.RAILWAY_ENVIRONMENT;

/* --------------------------------------------------------------- cookies */

function parseCookies(req) {
  const out = {};
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function setSessionCookie(res, token, expires) {
  const bits = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    'Path=/', 'HttpOnly', 'SameSite=Lax',
    `Expires=${new Date(expires).toUTCString()}`,
  ];
  if (isProd) bits.push('Secure');
  res.append('Set-Cookie', bits.join('; '));
}

function clearSessionCookie(res) {
  res.append('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

/* ------------------------------------------------------------ middleware */

function attachUser(req, _res, next) {
  req.user = A.userFromSession(parseCookies(req)[COOKIE]);
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'non_authentifie' });
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'non_authentifie' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'droits_insuffisants' });
    next();
  };
}

const canWrite = requireRole('admin', 'editeur');

/* ------------------------------------------------ amorçage : 1er compte */

// Au tout premier démarrage, crée le compte administrateur à partir des variables
// ADMIN_EMAIL / ADMIN_PASSWORD, puis charge l'état initial depuis seed-state.json.
function bootstrap() {
  if (A.countUsers() === 0) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (email && password) {
      A.createUser({ email, nom: process.env.ADMIN_NOM || 'Administrateur', password, role: 'admin' });
      console.log(`Compte administrateur créé : ${email}`);
    } else {
      console.warn('Aucun compte utilisateur. Renseignez ADMIN_EMAIL et ADMIN_PASSWORD puis redémarrez.');
    }
  }
  if (A.getState().data == null) {
    const p = path.join(__dirname, 'seed-state.json');
    if (fs.existsSync(p)) {
      try {
        const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
        const state = {
          v: 1,
          prospects: raw.prospects || [],
          factures: raw.factures || [],
          depenses: raw.depenses || [],
          tva: raw.tva ?? 0,
          rentaParams: raw.rentaParams || {},
          aConfirmer: raw.aConfirmer || [],
          formateurs: raw.formateurs || [],
        };
        A.saveState(JSON.stringify(state), 0, 'import initial');
        console.log(`État initial chargé : ${state.prospects.length} prospects, ` +
          `${state.factures.length} factures, ${state.depenses.length} dépenses, ` +
          `${state.formateurs.length} formateurs.`);
      } catch (e) { console.error('seed-state.json illisible :', e.message); }
    }
  }
}

/* ------------------------------------------- lead -> prospect (mapping) */

const FORMATION_MAP = [
  [/afgsu\s*2|gsu\s*2|niveau\s*2/i, 'afgsu2'],
  [/afgsu\s*1|gsu\s*1|niveau\s*1/i, 'afgsu1'],
  [/mac\s*sst/i, 'macsst'],
  [/\bmac\b|maintien|actualisation|recyclage/i, 'mac'],
  [/sst/i, 'sstin'],
  [/incendie|ssiap|extincteur/i, 'incendie'],
];

// Tarifs indicatifs par participant, servant à pré-remplir le montant estimé.
const TARIF_INDICATIF = { afgsu2: 480, afgsu1: 300, mac: 180, macsst: 90, sstin: 180, incendie: 90 };

// Référentiel des origines de lead, identique à celui de l'interface.
const ORIGINES_LEAD = {
  lonasante_ind:    { label: 'Lonasanté individuel', canal: 'LONASANTE' },
  lonasante_grp:    { label: 'Lonasanté groupe',     canal: 'LONASANTE' },
  adwords_ind:      { label: 'Adwords individuel',   canal: 'ADWORDS' },
  adwords_grp:      { label: 'Adwords groupe',       canal: 'ADWORDS' },
  partenaire:       { label: 'Partenaire',           canal: 'PARTENAIRE' },
  laboform:         { label: 'Laboform',             canal: 'LABOFORM' },
  client_recurrent: { label: 'Client récurent',      canal: 'CLIENT RECURENT', precision: true },
};
const canalDeLOrigine = (id) => (ORIGINES_LEAD[id] || {}).canal || 'LONASANTE';

function guessFormationId(lead) {
  const txt = `${lead.formationShort || ''} ${lead.formation || ''}`;
  for (const [re, id] of FORMATION_MAP) if (re.test(txt)) return id;
  return 'afgsu2';
}

function leadToProspect(lead) {
  const formationId = guessFormationId(lead);
  const nb = Number(lead.candidats) || 1;
  const contact = [lead.prenom, lead.nom].filter(Boolean).join(' ').trim();
  const entreprise = (lead.structure || contact || `Demande ${lead.dept}`).trim();
  const today = new Date().toISOString().slice(0, 10);
  const recu = (lead.receivedAt || '').slice(0, 10) || today;
  const email = /@/.test(lead.contact || '') ? lead.contact : '';
  const tel = !email && lead.contact ? lead.contact : '';
  return {
    id: `p_lona_${lead.id}`,
    contact,
    entreprise,
    email,
    tel,
    formationId,
    montant: Math.round((TARIF_INDICATIF[formationId] || 0) * nb),
    proba: 20,
    source: 'LONASANTE',
    origineId: lead.isGroup ? 'lonasante_grp' : 'lonasante_ind',
    origineDetail: '',
    stage: 'nouveau',
    dateCreation: recu,
    dateSignaturePrevue: '',
    motifPerte: '',
    derniereRelance: today,
    leadId: lead.id,
    notes: [{
      date: today,
      txt: `Issu de la demande LonaSanté n°${lead.id} — département ${lead.dept}, ` +
        `${nb} personne${nb > 1 ? 's' : ''}${lead.formation ? `, ${lead.formation}` : ''}. ` +
        `Montant pré-rempli à titre indicatif, à confirmer.`,
    }],
  };
}

/* ------------------------------------------------------------- le routeur */

const router = express.Router();

router.get('/api/auth/me', (req, res) => {
  if (!req.user) return res.json({ authentifie: false, compteExistant: A.countUsers() > 0 });
  res.json({ authentifie: true, utilisateur: req.user });
});

router.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const u = A.findUserByEmail(email);
  if (!u || !A.verifyPassword(password || '', u.pass_hash, u.pass_salt))
    return res.status(401).json({ error: 'identifiants_invalides' });
  const { token, expires } = A.createSession(u.id);
  setSessionCookie(res, token, expires);
  res.json({ utilisateur: { id: u.id, email: u.email, nom: u.nom, role: u.role } });
});

router.post('/api/auth/logout', (req, res) => {
  const t = parseCookies(req)[COOKIE];
  if (t) A.destroySession(t);
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.post('/api/auth/password', requireAuth, (req, res) => {
  const { ancien, nouveau } = req.body || {};
  if (!nouveau || String(nouveau).length < 8)
    return res.status(400).json({ error: 'mot_de_passe_trop_court', hint: '8 caractères minimum' });
  const u = A.findUserByEmail(req.user.email);
  if (!u || !A.verifyPassword(ancien || '', u.pass_hash, u.pass_salt))
    return res.status(401).json({ error: 'ancien_mot_de_passe_invalide' });
  A.setPassword(u.id, nouveau);
  res.json({ ok: true });
});

/* --- comptes (administrateurs) --- */

router.get('/api/users', requireRole('admin'), (_req, res) => res.json(A.listUsers()));

router.post('/api/users', requireRole('admin'), (req, res) => {
  const { email, nom, password, role } = req.body || {};
  if (!password || String(password).length < 8)
    return res.status(400).json({ error: 'mot_de_passe_trop_court', hint: '8 caractères minimum' });
  try { res.json({ id: A.createUser({ email, nom, password, role }) }); }
  catch (e) { res.status(400).json({ error: 'creation_impossible', message: e.message }); }
});

router.patch('/api/users/:id', requireRole('admin'), (req, res) => {
  const { nom, role, actif, password } = req.body || {};
  if (password) {
    if (String(password).length < 8) return res.status(400).json({ error: 'mot_de_passe_trop_court' });
    A.setPassword(req.params.id, password);
  }
  res.json({ ok: A.updateUser(req.params.id, { nom, role, actif }) });
});

/* --- état de pilotage partagé --- */

router.get('/api/state', requireAuth, (_req, res) => {
  const s = A.getState();
  res.json({ version: s.version, data: s.data, updatedAt: s.updatedAt, updatedBy: s.updatedBy });
});

router.put('/api/state', canWrite, (req, res) => {
  const { data, version } = req.body || {};
  if (typeof data !== 'string') return res.status(400).json({ error: 'data_attendu_en_chaine' });
  const who = `${req.user.nom} <${req.user.email}>`;
  const r = A.saveState(data, version, who);
  if (!r.ok && r.conflict) {
    return res.status(409).json({
      error: 'conflit_de_version',
      message: 'Les données ont été modifiées entre-temps par un autre utilisateur.',
      current: { version: r.current.version, data: r.current.data, updatedBy: r.current.updatedBy, updatedAt: r.current.updatedAt },
    });
  }
  res.json(r);
});

router.get('/api/state/history', requireAuth, (_req, res) => res.json(A.listHistory(30)));

router.get('/api/state/history/:id', requireRole('admin'), (req, res) => {
  const row = A.historyEntry(req.params.id);
  if (!row) return res.status(404).json({ error: 'introuvable' });
  res.json(row);
});

router.post('/api/state/restore/:id', requireRole('admin'), (req, res) => {
  const row = A.historyEntry(req.params.id);
  if (!row) return res.status(404).json({ error: 'introuvable' });
  const who = `${req.user.nom} (restauration v${row.version})`;
  res.json(A.saveState(row.data, A.getState().version, who));
});

/* --- demandes LonaSanté --- */

router.get('/api/leads', requireAuth, (req, res) => {
  const all = A.openLeads(2000);
  const nonTraites = String(req.query.nonTraites || '') === '1';
  res.json(nonTraites ? all.filter(l => !l.promotedProspectId && l.status === 'open') : all);
});

// Transforme une demande en prospect du pipeline CRM (bouton « Transformer en prospect »).
router.post('/api/leads/:id/promote', canWrite, (req, res) => {
  const lead = A.leadById(req.params.id);
  if (!lead) return res.status(404).json({ error: 'demande_introuvable' });
  if (lead.promotedProspectId)
    return res.status(409).json({ error: 'deja_transformee', prospectId: lead.promotedProspectId });

  const s = A.getState();
  let state;
  try { state = s.data ? JSON.parse(s.data) : { v: 1, prospects: [], factures: [], depenses: [], tva: 0, rentaParams: {} }; }
  catch { return res.status(500).json({ error: 'etat_illisible' }); }

  const saisi = (req.body && req.body.champs) || {};
  const prospect = { ...leadToProspect(lead), ...saisi };
  // L'origine fait foi : le canal en découle, pour que les analyses par canal restent justes.
  if (saisi.origineId !== undefined && !ORIGINES_LEAD[saisi.origineId]) prospect.origineId = null;
  prospect.source = prospect.origineId ? canalDeLOrigine(prospect.origineId) : (prospect.source || 'LONASANTE');
  if (prospect.origineId !== 'client_recurrent') prospect.origineDetail = '';
  prospect.montant = Number(prospect.montant) || 0;
  prospect.proba = Math.max(0, Math.min(100, Number(prospect.proba) || 0));
  state.prospects = [prospect, ...(state.prospects || [])];

  const who = `${req.user.nom} (transformation demande n°${lead.id})`;
  const r = A.saveState(JSON.stringify(state), s.version, who);
  if (!r.ok) return res.status(409).json({ error: 'conflit_de_version', message: 'Rechargez la page et réessayez.' });
  A.markPromoted(lead.id, prospect.id);
  res.json({ ok: true, prospect, version: r.version });
});

module.exports = { router, attachUser, requireAuth, requireRole, canWrite, bootstrap, leadToProspect };
