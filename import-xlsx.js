// import-xlsx.js — amorce la base avec l'historique du fichier LONASANTE_STATS_2025.xlsx.
// Usage : node import-xlsx.js /chemin/vers/LONASANTE_STATS_2025.xlsx
//
// Les feuilles ayant des formats différents, la configuration par feuille reproduit
// le mapping validé (colonne candidats / département-ou-CP / formation, ligne de début).

const XLSX = require('xlsx');
const { normalizeLead } = require('./parse');
const db = require('./db');

const FILE = process.argv[2];
if (!FILE) { console.error('Usage: node import-xlsx.js <fichier.xlsx>'); process.exit(1); }

// feuille -> { start (1-indexé), c:candidats, d:dept/cp, postal, f:formation, year, month }
const FR_MONTHS = { JANVIER:1, FEVRIER:2, 'FÉVRIER':2, MARS:3, AVRIL:4, MAI:5, JUIN:6,
                    JUILLET:7, AOUT:8, 'AOÛT':8, SEPTEMBRE:9, OCTOBRE:10, NOVEMBRE:11, 'DÉCEMBRE':12, DECEMBRE:12 };

const CFG = {
  'JANVIER 2025':   { start:2, c:2, d:3, postal:false, f:1 },
  'FEVRIER 2025':   { start:1, c:1, d:2, postal:false, f:0 },
  'MARS 2025':      { start:1, c:1, d:2, postal:false, f:0 },
  'AVRIL 2025':     { start:1, c:1, d:2, postal:false, f:0 },
  'MAI 2025':       { start:1, c:1, d:6, postal:true,  f:0 },
  'JUIN 2025':      { start:2, c:2, d:3, postal:true,  f:1 },
  'JUILLET 2025':   { start:1, c:null, d:null, postal:true, f:0 },
  'AOÛT 2025':      { start:1, c:2, d:5, postal:true,  f:0 },
  'SEPTEMBRE 2025': { start:2, c:1, d:4, postal:true,  f:0 },
};

function monthKeyFromSheet(name) {
  const m = name.toUpperCase().match(/([A-ZÀ-Ü]+)\s+(\d{4})/);
  if (!m) return null;
  const mm = FR_MONTHS[m[1]]; const yy = m[2];
  return mm ? `${yy}-${String(mm).padStart(2,'0')}` : null;
}

const wb = XLSX.readFile(FILE);
let total = 0, inserted = 0;

for (const sheet of wb.SheetNames) {
  const cfg = CFG[sheet.trim().toUpperCase()] || guessConfig(sheet);
  if (!cfg || cfg.c === null) continue;
  const monthKey = monthKeyFromSheet(sheet);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1, raw: true, defval: null });
  const leads = [];
  for (let r = (cfg.start - 1); r < rows.length; r++) {
    const row = rows[r]; if (!row) continue;
    const form = row[0];
    if (form == null || String(form).trim() === '') continue;
    if (['FOR', 'SUBMISSION DATE'].includes(String(form).trim().toUpperCase())) continue;
    const base = cfg.postal
      ? { formation: row[cfg.f], candidats: row[cfg.c], code_postal: row[cfg.d] }
      : { formation: row[cfg.f], candidats: row[cfg.c], departement: row[cfg.d] };
    base.date = `${monthKey}-15`;
    base.submissionId = `xlsx:${sheet}:${r}`;   // unicité stable -> ré-import idempotent
    const lead = normalizeLead(base);
    if (lead) { lead.monthKey = monthKey || lead.monthKey; leads.push(lead); }
  }
  total += leads.length;
  const n = db.insertMany(leads);
  inserted += n;
  console.log(`${sheet.padEnd(18)} ${leads.length} lead(s) exploitable(s), ${n} importé(s)`);
}

// repli si une feuille n'est pas connue : suppose [formation, candidats, code_postal]
function guessConfig() { return { start:1, c:1, d:2, postal:true, f:0 }; }

console.log(`\nTotal : ${total} leads lus, ${inserted} insérés, base = ${db.count()} lignes.`);
