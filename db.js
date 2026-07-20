// db.js — stockage via SQLite intégré à Node (node:sqlite). Aucun module natif.

const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'leads.db');
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL;');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    dedup_key       TEXT UNIQUE,
    received_at     TEXT NOT NULL,
    month_key       TEXT NOT NULL,
    dept            TEXT NOT NULL,
    candidats       INTEGER NOT NULL,
    is_group        INTEGER NOT NULL,
    formation       TEXT,
    formation_short TEXT,
    nom             TEXT,
    prenom          TEXT,
    structure       TEXT,
    contact         TEXT,
    status          TEXT DEFAULT 'open',
    sale_price      REAL,
    created_at      TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_month ON leads(month_key);
  CREATE INDEX IF NOT EXISTS idx_dept  ON leads(dept);
`);

// Migration : ajoute les colonnes manquantes si la base est antérieure à cette version.
const existing = new Set(db.prepare('PRAGMA table_info(leads)').all().map(r => r.name));
for (const [col, def] of [
  ['nom', 'TEXT'], ['prenom', 'TEXT'], ['structure', 'TEXT'], ['contact', 'TEXT'],
  ['status', "TEXT DEFAULT 'open'"], ['sale_price', 'REAL'],
]) if (!existing.has(col)) db.exec(`ALTER TABLE leads ADD COLUMN ${col} ${def}`);

const insertIgnore = db.prepare(`
  INSERT OR IGNORE INTO leads
    (dedup_key, received_at, month_key, dept, candidats, is_group, formation, formation_short, nom, prenom, structure, contact)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
// met à jour les champs ANALYSÉS d'une ligne existante, sans toucher au statut/prix saisis par l'utilisateur
const updateParsed = db.prepare(`
  UPDATE leads SET month_key=?, dept=?, candidats=?, is_group=?, formation=?, formation_short=?,
                   nom=?, prenom=?, structure=?, contact=?
  WHERE dedup_key=?
`);

function insertLead(l) {
  const info = insertIgnore.run(
    l.dedupKey, l.receivedAt, l.monthKey, l.dept, l.candidats, l.isGroup,
    l.formation ?? null, l.formationShort ?? null,
    l.nom ?? null, l.prenom ?? null, l.structure ?? null, l.contact ?? null
  );
  if (Number(info.changes) > 0) return true; // nouvelle ligne
  updateParsed.run(                          // ligne existante : on complète les infos analysées
    l.monthKey, l.dept, l.candidats, l.isGroup, l.formation ?? null, l.formationShort ?? null,
    l.nom ?? null, l.prenom ?? null, l.structure ?? null, l.contact ?? null, l.dedupKey
  );
  return false;
}

function insertMany(leads) {
  db.exec('BEGIN');
  try {
    let n = 0;
    for (const l of leads) if (insertLead(l)) n++;
    db.exec('COMMIT');
    return n;
  } catch (e) { db.exec('ROLLBACK'); throw e; }
}

const statusStmt = db.prepare('UPDATE leads SET status=?, sale_price=? WHERE id=?');
function setStatus(id, status, price) {
  const info = statusStmt.run(status, price == null ? null : Number(price), Number(id));
  return Number(info.changes) > 0;
}

function allLeads() {
  return db.prepare(`
    SELECT id, month_key AS monthKey, dept, candidats, is_group AS isGroup,
           formation, formation_short AS formationShort, contact, status, sale_price AS salePrice,
           promoted_prospect_id AS promotedProspectId
    FROM leads ORDER BY month_key, dept
  `).all();
}

function count() { return Number(db.prepare('SELECT COUNT(*) AS n FROM leads').get().n); }

module.exports = { db, insertLead, insertMany, setStatus, allLeads, count, DB_PATH };
