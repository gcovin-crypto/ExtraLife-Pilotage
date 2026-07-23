// reconcile.js — rapprochement entre les sessions saisies dans la plateforme
// et celles remontées de Digiforma.
//
// Règle absolue : ce module ne modifie jamais rien. Il compare et signale.
// Toute reprise de valeur est un geste explicite de l'utilisateur, champ par champ.

/* --------------------------------------------------- comparaison de texte */

// Normalise pour comparer : minuscules, sans accents, sans ponctuation,
// sans les mots vides fréquents dans les raisons sociales.
const VIDES = new Set(['le', 'la', 'les', 'de', 'du', 'des', 'et', 'l', 'd',
  'sa', 'sas', 'sarl', 'sasu', 'eurl', 'sci', 'scp', 'asso', 'association',
  'cabinet', 'centre', 'groupe', 'ste', 'societe']);

function jetons(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ')
    .split(' ').filter((m) => m.length > 1 && !VIDES.has(m));
}

// Similarité de Jaccard entre deux ensembles de mots : 0 à 1.
function similitude(a, b) {
  const A = new Set(jetons(a)), B = new Set(jetons(b));
  if (!A.size || !B.size) return 0;
  let commun = 0;
  A.forEach((m) => { if (B.has(m)) commun++; });
  return commun / (A.size + B.size - commun);
}

const joursEntre = (d1, d2) => {
  const a = Date.parse(d1), b = Date.parse(d2);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.abs(a - b) / 864e5;
};

/* -------------------------------------------------- score de rapprochement */

// La date est le critère dominant : deux sessions du même client à des mois
// d'écart sont deux sessions distinctes, pas la même vue deux fois.
function score(local, distant) {
  const ecart = joursEntre(local.date, distant.date);
  if (ecart === null || ecart > 10) return { total: 0, motifs: [] };

  const motifs = [];
  let total = 0;

  if (ecart === 0) { total += 45; motifs.push('même date'); }
  else if (ecart <= 2) { total += 32; motifs.push(`${ecart} j d'écart`); }
  else { total += 15; motifs.push(`${Math.round(ecart)} j d'écart`); }

  const sClient = similitude(local.client, distant.client);
  if (sClient >= 0.8) { total += 35; motifs.push('même client'); }
  else if (sClient >= 0.4) { total += 20; motifs.push('client proche'); }
  else if (sClient > 0) { total += 8; }

  const sForm = similitude(local.formateur, distant.formateur);
  if (sForm >= 0.5) { total += 12; motifs.push('même formateur'); }

  const ml = Number(local.montantHT) || 0, md = Number(distant.montantHT) || 0;
  if (ml > 0 && md > 0) {
    const rel = Math.abs(ml - md) / Math.max(ml, md);
    if (rel < 0.01) { total += 15; motifs.push('même montant'); }
    else if (rel < 0.1) { total += 8; motifs.push('montant proche'); }
  }

  return { total, motifs };
}

const SEUIL_SUR = 70;     // rapprochement retenu d'office
const SEUIL_DOUTE = 45;   // rapprochement proposé, à confirmer

/* ------------------------------------------------------ champs comparés */

// Chaque entrée : clé locale, clé distante, libellé, type, et tolérance
// au-delà de laquelle l'écart est signalé.
const CHAMPS = [
  { loc: 'montantHT', dist: 'montantHT', label: 'CA HT', type: 'euro', tol: 0.5 },
  { loc: 'coutVar', dist: 'coutVar', label: 'Coût direct', type: 'euro', tol: 0.5 },
  { loc: 'cFormateur', dist: 'cFormateur', label: 'Coût formateur', type: 'euro', tol: 0.5 },
  { loc: 'nbParticipants', dist: 'nbParticipants', label: 'Apprenants', type: 'nombre', tol: 0 },
  { loc: 'placesMax', dist: 'placesMax', label: 'Capacité', type: 'nombre', tol: 0 },
  { loc: 'heures', dist: 'heures', label: 'Durée (h)', type: 'nombre', tol: 0.25 },
  { loc: 'satisfaction', dist: 'satisfaction', label: 'Satisfaction', type: 'nombre', tol: 0.1 },
  { loc: 'formateur', dist: 'formateur', label: 'Formateur', type: 'texte' },
  { loc: 'client', dist: 'client', label: 'Client', type: 'texte' },
];

const vide = (v) => v === null || v === undefined || v === '' ||
  (typeof v === 'number' && !Number.isFinite(v));

function comparerChamp(c, local, distant) {
  const vl = local[c.loc], vd = distant[c.dist];
  const absentL = vide(vl), absentD = vide(vd);

  if (absentD) return null;                       // Digiforma n'a rien à dire
  if (absentL) return { ...c, local: null, distant: vd, nature: 'manquant' };

  if (c.type === 'texte') {
    return similitude(vl, vd) >= 0.6 ? null
      : { ...c, local: vl, distant: vd, nature: 'divergent' };
  }
  const nl = Number(vl), nd = Number(vd);
  if (!Number.isFinite(nl) || !Number.isFinite(nd)) return null;
  if (Math.abs(nl - nd) <= (c.tol || 0)) return null;
  return { ...c, local: nl, distant: nd, ecart: nd - nl, nature: 'divergent' };
}

/* ------------------------------------------------------ rapprochement */

// locaux   : sessions de la plateforme, enrichies { id, date, client, formateur, ... }
// distants : sessions Digiforma normalisées
function rapprocher(locaux, distants) {
  const paires = [];
  const prisD = new Set();
  const prisL = new Set();

  // Chaque session locale cherche son meilleur candidat distant encore libre.
  const candidats = [];
  (locaux || []).forEach((l) => {
    (distants || []).forEach((d) => {
      const s = score(l, d);
      if (s.total >= SEUIL_DOUTE) candidats.push({ l, d, ...s });
    });
  });
  candidats.sort((a, b) => b.total - a.total);

  candidats.forEach(({ l, d, total, motifs }) => {
    if (prisL.has(l.id) || prisD.has(d.digiformaId)) return;
    prisL.add(l.id); prisD.add(d.digiformaId);
    const ecarts = CHAMPS.map((c) => comparerChamp(c, l, d)).filter(Boolean);
    paires.push({
      localId: l.id,
      digiformaId: d.digiformaId,
      confiance: total >= SEUIL_SUR ? 'sure' : 'a_confirmer',
      score: total,
      motifs,
      local: l,
      distant: d,
      ecarts,
      manquants: ecarts.filter((e) => e.nature === 'manquant').length,
      divergents: ecarts.filter((e) => e.nature === 'divergent').length,
    });
  });

  const orphelinsDistants = (distants || []).filter((d) => !prisD.has(d.digiformaId));
  const orphelinsLocaux = (locaux || []).filter((l) => !prisL.has(l.id));

  return {
    paires: paires.sort((a, b) => String(b.local.date).localeCompare(String(a.local.date))),
    orphelinsDistants: orphelinsDistants.sort((a, b) => String(b.date).localeCompare(String(a.date))),
    orphelinsLocaux: orphelinsLocaux.sort((a, b) => String(b.date).localeCompare(String(a.date))),
    resume: {
      rapprochees: paires.length,
      sures: paires.filter((p) => p.confiance === 'sure').length,
      aConfirmer: paires.filter((p) => p.confiance === 'a_confirmer').length,
      avecEcart: paires.filter((p) => p.ecarts.length > 0).length,
      champsManquants: paires.reduce((t, p) => t + p.manquants, 0),
      champsDivergents: paires.reduce((t, p) => t + p.divergents, 0),
      aImporter: orphelinsDistants.length,
      horsDigiforma: orphelinsLocaux.length,
    },
  };
}

module.exports = { rapprocher, score, similitude, CHAMPS, SEUIL_SUR, SEUIL_DOUTE };
