// db-app.js — comptes utilisateurs, sessions et état de pilotage (prospects,
// factures, dépenses, paramètres). Réutilise la même base SQLite que les leads.

const crypto = require('crypto');
const { db } = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT UNIQUE NOT NULL,
    nom         TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'editeur',
    pass_hash   TEXT NOT NULL,
    pass_salt   TEXT NOT NULL,
    actif       INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now')),
    last_login  TEXT
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS app_state (
    id         INTEGER PRIMARY KEY CHECK (id = 1),
    version    INTEGER NOT NULL DEFAULT 0,
    data       TEXT NOT NULL,
    updated_at TEXT,
    updated_by TEXT
  );
  CREATE TABLE IF NOT EXISTS state_history (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    version    INTEGER NOT NULL,
    data       TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')),
    updated_by TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_hist_version ON state_history(version);
`);

// Colonne de liaison lead -> prospect CRM (migration douce)
{
  const cols = new Set(db.prepare('PRAGMA table_info(leads)').all().map(r => r.name));
  if (!cols.has('promoted_prospect_id')) db.exec('ALTER TABLE leads ADD COLUMN promoted_prospect_id TEXT');
  if (!cols.has('promoted_at')) db.exec('ALTER TABLE leads ADD COLUMN promoted_at TEXT');
}

/* ---------------------------------------------------------------- comptes */

const ROLES = ['admin', 'editeur', 'lecteur'];

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return { hash, salt };
}

function verifyPassword(password, hash, salt) {
  const candidate = crypto.scryptSync(String(password), salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

function createUser({ email, nom, password, role = 'editeur' }) {
  if (!email || !password) throw new Error('email et mot de passe requis');
  if (!ROLES.includes(role)) throw new Error('rôle inconnu');
  const { hash, salt } = hashPassword(password);
  const info = db.prepare(
    'INSERT INTO users (email, nom, role, pass_hash, pass_salt) VALUES (?, ?, ?, ?, ?)'
  ).run(String(email).trim().toLowerCase(), nom || email, role, hash, salt);
  return Number(info.lastInsertRowid);
}

function findUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ? AND actif = 1')
    .get(String(email || '').trim().toLowerCase());
}

function listUsers() {
  return db.prepare(
    'SELECT id, email, nom, role, actif, created_at, last_login FROM users ORDER BY nom'
  ).all();
}

function setPassword(userId, password) {
  const { hash, salt } = hashPassword(password);
  return Number(db.prepare('UPDATE users SET pass_hash = ?, pass_salt = ? WHERE id = ?')
    .run(hash, salt, Number(userId)).changes) > 0;
}

function updateUser(userId, { nom, role, actif }) {
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(userId));
  if (!u) return false;
  const r = role && ROLES.includes(role) ? role : u.role;
  return Number(db.prepare('UPDATE users SET nom = ?, role = ?, actif = ? WHERE id = ?')
    .run(nom ?? u.nom, r, actif == null ? u.actif : (actif ? 1 : 0), Number(userId)).changes) > 0;
}

function countUsers() {
  return Number(db.prepare('SELECT COUNT(*) AS n FROM users').get().n);
}

/* -------------------------------------------------------------- sessions */

const SESSION_DAYS = 30;

function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)')
    .run(token, Number(userId), expires);
  db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(Number(userId));
  return { token, expires };
}

function userFromSession(token) {
  if (!token) return null;
  const row = db.prepare(`
    SELECT u.id, u.email, u.nom, u.role, s.expires_at
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token = ? AND u.actif = 1
  `).get(String(token));
  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) { destroySession(token); return null; }
  return { id: row.id, email: row.email, nom: row.nom, role: row.role };
}

function destroySession(token) {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(String(token));
}

function purgeExpiredSessions() {
  db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
}

/* ---------------------------------------------------- état de pilotage */

const HISTORY_KEEP = 60;

function getState() {
  const row = db.prepare('SELECT version, data, updated_at, updated_by FROM app_state WHERE id = 1').get();
  if (!row) return { version: 0, data: null, updatedAt: null, updatedBy: null };
  return { version: Number(row.version), data: row.data, updatedAt: row.updated_at, updatedBy: row.updated_by };
}

// Écriture avec verrou optimiste : refuse si la version attendue n'est plus la version courante.
function saveState(dataString, expectedVersion, who) {
  const current = getState();
  if (expectedVersion != null && Number(expectedVersion) !== current.version) {
    return { ok: false, conflict: true, current };
  }
  const next = current.version + 1;
  const now = new Date().toISOString();
  db.exec('BEGIN');
  try {
    db.prepare(`
      INSERT INTO app_state (id, version, data, updated_at, updated_by) VALUES (1, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET version = excluded.version, data = excluded.data,
                                    updated_at = excluded.updated_at, updated_by = excluded.updated_by
    `).run(next, dataString, now, who || null);
    db.prepare('INSERT INTO state_history (version, data, updated_by) VALUES (?, ?, ?)')
      .run(next, dataString, who || null);
    db.prepare(`
      DELETE FROM state_history WHERE id NOT IN
        (SELECT id FROM state_history ORDER BY id DESC LIMIT ${HISTORY_KEEP})
    `).run();
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
  return { ok: true, version: next, updatedAt: now, updatedBy: who || null };
}

function listHistory(limit = 30) {
  return db.prepare(
    'SELECT id, version, updated_at, updated_by, length(data) AS taille FROM state_history ORDER BY id DESC LIMIT ?'
  ).all(Number(limit));
}

function historyEntry(id) {
  return db.prepare('SELECT id, version, data, updated_at, updated_by FROM state_history WHERE id = ?')
    .get(Number(id));
}

/* ------------------------------------------- leads : liaison au pipeline */

function openLeads(limit = 400) {
  return db.prepare(`
    SELECT id, received_at AS receivedAt, month_key AS monthKey, dept, candidats,
           is_group AS isGroup, formation, formation_short AS formationShort,
           nom, prenom, structure, contact, status, sale_price AS salePrice,
           promoted_prospect_id AS promotedProspectId, promoted_at AS promotedAt
    FROM leads ORDER BY received_at DESC LIMIT ?
  `).all(Number(limit));
}

function leadById(id) {
  return db.prepare(`
    SELECT id, received_at AS receivedAt, month_key AS monthKey, dept, candidats,
           is_group AS isGroup, formation, formation_short AS formationShort,
           nom, prenom, structure, contact, status,
           promoted_prospect_id AS promotedProspectId
    FROM leads WHERE id = ?
  `).get(Number(id));
}

function markPromoted(leadId, prospectId) {
  return Number(db.prepare(
    "UPDATE leads SET promoted_prospect_id = ?, promoted_at = datetime('now') WHERE id = ?"
  ).run(String(prospectId), Number(leadId)).changes) > 0;
}

module.exports = {
  ROLES, hashPassword, verifyPassword, createUser, findUserByEmail, listUsers,
  setPassword, updateUser, countUsers,
  createSession, userFromSession, destroySession, purgeExpiredSessions,
  getState, saveState, listHistory, historyEntry,
  openLeads, leadById, markPromoted,
};
