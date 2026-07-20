// parse.js — normalisation d'un "lead" (demande de formation) en un enregistrement propre.
// Reprend EXACTEMENT la logique validée sur le fichier LONASANTE_STATS_2025.xlsx :
//  - code postal -> département (zéro-comblage, DOM 97x, Corse 2A/2B)
//  - département donné en clair -> code 2 chiffres
//  - classification groupe (>4 apprenants) / individuel (<=4)
//  - normalisation du libellé de formation

const geo = require('./geo.json');

const DOM = { '971':'Guadeloupe','972':'Martinique','973':'Guyane','974':'La Réunion',
              '976':'Mayotte','988':'Nlle-Calédonie','97':'DOM (non précisé)' };

// Ensemble des codes dessinables (métropole + Corse + DOM gérés)
const VALID = new Set([...Object.keys(geo.deps), ...Object.keys(DOM)]);

const GROUP_THRESHOLD = 4; // > 4 => groupe (jaune) ; <= 4 => individuel (vert)

function toInt(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = parseInt(String(v).replace(/\s/g, '').replace(',', '.'), 10);
  return Number.isNaN(n) ? null : n;
}

// Code postal -> code département
function cpToDept(cp) {
  const n = toInt(cp);
  if (n === null) return null;
  const s = String(n).padStart(5, '0');
  if (s.length > 5) return null;                 // aberrant
  if (s.startsWith('97') || s.startsWith('98')) return s.slice(0, 3); // DOM/COM
  if (s.startsWith('20')) return parseInt(s.slice(0, 3), 10) <= 201 ? '2A' : '2B'; // Corse (approx)
  return s.slice(0, 2);
}

// Département donné directement (numéro)
function deptDirect(v) {
  const n = toInt(v);
  if (n === null) return null;
  if (n >= 970) return String(n);
  if (n === 20) return '2A';
  return String(n).padStart(2, '0');
}

// Libellé de formation -> code court d'affichage
function shortForm(f) {
  if (!f) return 'AFGSU';
  const s = String(f).toUpperCase();
  if (s.includes('MAC')) return 'MAC AFGSU';
  if (s.includes('SST')) return 'SST';
  if (/(NIVEAU 2|GSU 2|AFGSU 2|AFGS 2|AFGSU2)/.test(s)) return 'AFGSU 2';
  if (/(NIVEAU 1|GSU 1|AFGSU 1|AFGS 1|AFGSU1)/.test(s)) return 'AFGSU 1';
  if (s.includes('GSU') || s.includes('AFGSU')) return 'AFGSU';
  return String(f).trim().slice(0, 24) || 'Formation';
}

// --- Résolution souple des champs (les fournisseurs de formulaire nomment tout différemment) ---
const norm = (k) => String(k).toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
  .replace(/[^a-z0-9]/g, '');                       // garde alphanum

function pick(obj, candidates) {
  const map = {};
  for (const k of Object.keys(obj)) map[norm(k)] = obj[k];
  for (const c of candidates) {                 // correspondance exacte (normalisée)
    if (map[c] !== undefined && map[c] !== '') return map[c];
  }
  for (const c of candidates) {                 // correspondance "contient" (tokens distinctifs uniquement)
    if (c.length < 4) continue;                  // évite que "id" matche "candidats", "cp" matche n'importe quoi
    for (const k of Object.keys(map)) {
      if (k.includes(c) && map[k] !== '' && map[k] !== undefined) return map[k];
    }
  }
  return undefined;
}

/**
 * Normalise un lead brut en enregistrement prêt à stocker.
 * Accepte aussi bien des champs explicites (formation, candidats, code_postal, departement, date)
 * que les libellés bruts d'un Jotform/Tally.
 * @returns {object|null} { receivedAt, monthKey, formation, formationShort, candidats, dept, isGroup, dedupKey } ou null si non exploitable
 */
function normalizeLead(raw, opts = {}) {
  if (!raw || typeof raw !== 'object') return null;
  // certains webhooks emboîtent les réponses (ex: { rawRequest:{...} } ou { data:{...} })
  const body = raw.answers || raw.fields || raw.data || raw;

  const formationRaw = pick(body, ['formation', 'quelleformationrecherchezvous', 'for', 'cours', 'stage', 'training']);
  const candRaw      = pick(body, ['candidats', 'apprenants', 'nbr', 'nombre', 'nombredepersonnes', 'nombredepersonnesaformer', 'participants', 'effectif']);
  const cpRaw        = pick(body, ['codepostal', 'cp', 'postal', 'zip', 'vosinformationscodepostal5', 'vosinformationscodepostal']);
  const deptRaw      = pick(body, ['departement', 'dept', 'department']);
  const dateRaw      = pick(body, ['date', 'submissiondate', 'createdat', 'received', 'horodatage', 'timestamp']);
  const subId        = pick(body, ['submissionid', 'id', 'entryid', 'responseid', 'submissionidkey']);

  // Département : code postal prioritaire, sinon numéro direct
  let dept = null;
  if (cpRaw !== undefined) dept = cpToDept(cpRaw);
  if (!dept && deptRaw !== undefined) dept = deptDirect(deptRaw);
  if (!dept || !VALID.has(dept)) return null;   // étranger / invalide => exclu de la carte

  let candidats = toInt(candRaw);
  if (candidats === null || candidats < 1) candidats = 1;

  const date = dateRaw ? new Date(dateRaw) : new Date();
  const d = isNaN(date) ? new Date() : date;
  const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

  // Écarte les valeurs qui sont en réalité un "public"/une civilité et non une formation
  const isFormation = v => /afgsu|\bgsu\b|\bsst\b|secours?|urgence|incendie|habilitation|recyclage|\bmac\b|formation/i.test(String(v || ''));
  const looksLikePublic = v => /profession|param[ée]dical|particulier|salari[ée]|demandeur|[ée]tudiant|monsieur|madame|\bmme\b|grand public/i.test(String(v || ''));
  const formationClean = (formationRaw && looksLikePublic(formationRaw) && !isFormation(formationRaw)) ? null : formationRaw;

  const formationShort = shortForm(formationClean);
  const isGroup = candidats > GROUP_THRESHOLD;

  // Identité du demandeur
  const nom = pick(body, ['nom', 'nomdefamille']);
  const prenom = pick(body, ['prenom']);
  const structure = pick(body, ['structure', 'organisme', 'etablissement', 'societe', 'entreprise',
    'raisonsociale', 'nomdelastructure', 'nometablissement', 'collectivite', 'nomdelentreprise']);
  const fullName = [prenom, nom].filter(Boolean).map(s => String(s).trim()).join(' ').trim() || null;
  // groupe -> on privilégie la structure ; individuel -> le nom de la personne
  const contact = isGroup ? (structure || fullName) : (fullName || structure);

  // clé de déduplication : id fournisseur si présent, sinon empreinte du contenu
  const dedupKey = subId
    ? `id:${subId}`
    : `h:${monthKey}|${dept}|${candidats}|${formationShort}|${d.toISOString().slice(0,10)}`;

  return {
    receivedAt: d.toISOString(),
    monthKey,
    formation: formationClean ? String(formationClean).slice(0, 200) : null,
    formationShort,
    candidats,
    dept,
    isGroup: isGroup ? 1 : 0,
    nom: nom ? String(nom).slice(0, 120) : null,
    prenom: prenom ? String(prenom).slice(0, 120) : null,
    structure: structure ? String(structure).slice(0, 160) : null,
    contact: contact ? String(contact).slice(0, 200) : null,
    dedupKey,
  };
}

// Construit le payload de stats attendu par la carte, à partir d'une liste de leads normalisés.
function buildStats(leads) {
  const byMonth = {};            // monthKey -> dept -> agrégat
  const rows = [];               // liste plate pour le tableau : [monthKey, dept, candidats, isGroup, formationShort]
  for (const l of leads) {
    const m = (byMonth[l.monthKey] ||= {});
    const d = (m[l.dept] ||= { ind: 0, grp: 0, cand: 0, req: 0, gl: [], gc: 0 });
    d.req += 1; d.cand += l.candidats;
    if (l.isGroup) { d.grp += 1; d.gl.push([l.candidats, l.formationShort]); d.gc += l.candidats; }
    else { d.ind += 1; }
    rows.push({
      id: l.id ?? null,
      m: l.monthKey,
      dept: l.dept,
      cand: l.candidats,
      grp: l.isGroup ? 1 : 0,
      f: l.formation || l.formationShort || null,
      who: l.contact || null,
      status: l.status || 'open',
      price: (l.salePrice ?? null),
      promoted: l.promotedProspectId ? 1 : 0,
    });
  }
  // tri des groupes par taille décroissante ; nettoyage des champs vides
  for (const m of Object.values(byMonth)) {
    for (const d of Object.values(m)) {
      d.gl.sort((a, b) => b[0] - a[0]);
      if (!d.gl.length) { delete d.gl; delete d.gc; }
    }
  }
  const monthKeys = Object.keys(byMonth).sort();
  const FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const months = monthKeys.map(k => {
    const [y, mm] = k.split('-');
    return `${FR[+mm - 1]} ${y}`;
  });
  return { months, monthKeys, data: byMonth, rows, domNames: DOM, updatedAt: new Date().toISOString() };
}

module.exports = { normalizeLead, buildStats, cpToDept, deptDirect, shortForm, toInt, VALID, DOM, GROUP_THRESHOLD };
