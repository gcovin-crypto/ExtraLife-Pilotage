// digiforma.js — connecteur vers l'API GraphQL de Digiforma.
//
// Principe directeur : ne rien supposer du schéma. Le connecteur interroge
// d'abord Digiforma par introspection pour savoir quels champs existent
// réellement, puis construit sa requête avec ces seuls champs. Si Digiforma
// fait évoluer son modèle, la synchronisation se dégrade au lieu de casser.
//
// Lecture seule : aucune mutation n'est envoyée à Digiforma.

const ENDPOINT = process.env.DIGIFORMA_ENDPOINT || 'https://app.digiforma.com/api/v1/graphql';
const TOKEN = () => process.env.DIGIFORMA_TOKEN || '';
const PAGE = 100;

class DigiformaError extends Error {
  constructor(code, message, details) {
    super(message || code);
    this.code = code;
    this.details = details;
  }
}

/* ------------------------------------------------------------- transport */

async function gql(query, variables = {}) {
  if (!TOKEN()) throw new DigiformaError('token_absent',
    "La variable DIGIFORMA_TOKEN n'est pas renseignée.");

  let r;
  try {
    r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (e) {
    throw new DigiformaError('reseau', `Digiforma injoignable : ${e.message}`);
  }

  if (r.status === 401 || r.status === 403)
    throw new DigiformaError('authentification',
      'Token refusé par Digiforma. Vérifiez qu\'il est valide et que l\'option API est active.');
  if (!r.ok)
    throw new DigiformaError('http', `Digiforma a répondu ${r.status}.`);

  const data = await r.json().catch(() => null);
  if (!data) throw new DigiformaError('reponse_illisible', 'Réponse non JSON.');
  if (data.errors && data.errors.length) {
    const msg = data.errors.map((e) => e.message).join(' · ');
    throw new DigiformaError('graphql', msg, data.errors);
  }
  return data.data;
}

/* ---------------------------------------------------------- introspection */

// Renvoie { NomDuType: Set(champs) } pour les types qui nous intéressent.
async function decouvrirSchema() {
  const types = ['TrainingSession', 'TrainingSessionCost', 'TrainingSessionSlot',
    'Invoice', 'InvoiceItem', 'InvoicePayment', 'Customer', 'Company',
    'Instructor', 'Program', 'ProgramCapacity', 'EvaluationsScores', 'Trainee'];
  const q = `query Schema {\n` + types.map((t, i) =>
    `  t${i}: __type(name: "${t}") { name fields { name type { kind name ofType { kind name } } } }`
  ).join('\n') + `\n}`;
  const d = await gql(q);
  const out = {};
  Object.values(d || {}).forEach((t) => {
    if (t && t.name) {
      out[t.name] = {};
      (t.fields || []).forEach((f) => {
        const noyau = f.type.ofType || f.type;
        out[t.name][f.name] = { kind: f.type.kind, type: noyau.name || f.type.name };
      });
    }
  });
  return out;
}

const a = (schema, type, champ) => !!(schema[type] && schema[type][champ]);

// Les champs d'un objet d'entrée (Pagination, filtres...) ne sont pas devinables.
async function decouvrirEntree(nom) {
  const d = await gql(`query { __type(name: "${nom}") { name inputFields { name type { kind name ofType { kind name } } } } }`);
  const t = d && d.__type;
  if (!t) return null;
  const out = {};
  (t.inputFields || []).forEach((f) => {
    const noyau = f.type.ofType || f.type;
    out[f.name] = noyau.name || f.type.name;
  });
  return out;
}

// Essaie chaque bloc facultatif isolément pour identifier celui qui échoue.
async function testerBlocs(schema) {
  const base = champs(schema, 'TrainingSession', ['id', 'name', 'startDate']);
  await trouverClePagination();
  const complet = construireRequete(schema);
  const blocs = (complet.match(/^\s{4}\w+ \{[\s\S]*?^\s{4}\}/gm) || [])
    .concat(complet.split('\n').filter((l) => /^\s{4}\w+ \{ .* \}$/.test(l)));
  const resultats = [];
  for (const b of blocs) {
    const nom = (b.trim().match(/^(\w+)/) || [])[1] || '?';
    const q = `query T($p: Pagination) { trainingSessions(pagination: $p) { ${base.join(' ')} ${b.trim()} } }`;
    try { await gql(q, { p: pagination(0, 1) }); resultats.push({ bloc: nom, ok: true }); }
    catch (e) { resultats.push({ bloc: nom, ok: false, message: e.message }); }
  }
  // La requête minimale, sans aucun bloc
  try {
    await gql(`query T($p: Pagination) { trainingSessions(pagination: $p) { ${base.join(' ')} } }`,
      { p: pagination(0, 1) });
    resultats.unshift({ bloc: '(champs simples)', ok: true });
  } catch (e) {
    resultats.unshift({ bloc: '(champs simples)', ok: false, message: e.message });
  }
  return resultats;
}

// Ne garde que les champs réellement présents dans le schéma distant.
const champs = (schema, type, liste) => liste.filter((c) => a(schema, type, c));

// Tous les champs simples d'un type : utile quand on ignore lesquels existent.
const SCALAIRES = new Set(['SCALAR', 'ENUM', 'NON_NULL', 'LIST']);
const tousScalaires = (schema, type) => {
  const t = schema[type];
  if (!t) return [];
  return Object.keys(t).filter((k) => {
    const f = t[k];
    return SCALAIRES.has(f.kind) &&
      ['String', 'Int', 'Float', 'Boolean', 'ID', 'Date', 'DateTime', 'NaiveDateTime', 'Time']
        .includes(f.type);
  });
};

/* ------------------------------------------- construction de la requête */

function construireRequete(schema) {
  const scalaires = champs(schema, 'TrainingSession', [
    'id', 'name', 'code', 'startDate', 'endDate', 'pipelineState',
    'inter', 'remote', 'contracted', 'dpc', 'frozenAt', 'place', 'placeName',
    'address', 'type', 'trainingType', 'benefits', 'updatedAt', 'insertedAt',
  ]);
  const bloc = [...scalaires];

  if (a(schema, 'TrainingSession', 'program')) {
    const p = champs(schema, 'Program', ['id', 'name', 'code']);
    // La capacité vit sur le programme : « Limites d'effectif », min et max.
    if (a(schema, 'Program', 'capacity')) {
      const cap = champs(schema, 'ProgramCapacity',
        ['active', 'min', 'max', 'minTrainees', 'maxTrainees', 'minimum', 'maximum', 'enabled']);
      if (cap.length) p.push(`capacity { ${cap.join(' ')} }`);
    }
    bloc.push(`program { ${p.join(' ') || 'id'} }`);
  }

  if (a(schema, 'TrainingSession', 'instructors'))
    bloc.push(`instructors { ${champs(schema, 'Instructor', ['id', 'firstname', 'lastname', 'email']).join(' ') || 'id'} }`);

  if (a(schema, 'TrainingSession', 'trainees'))
    bloc.push(`trainees { ${champs(schema, 'Trainee', ['id', 'firstname', 'lastname']).join(' ') || 'id'} }`);

  if (a(schema, 'TrainingSession', 'costs')) {
    const c = champs(schema, 'TrainingSessionCost',
      ['id', 'cost', 'costIndependant', 'costIndividual', 'costMode', 'description',
       'monthly', 'type', 'vat', 'amount', 'value', 'name', 'quantity', 'unitPrice']);
    if (c.length) bloc.push(`costs { ${c.join(' ')} }`);
  }

  if (a(schema, 'TrainingSession', 'trainingSessionSlots')) {
    const c = champs(schema, 'TrainingSessionSlot',
      ['id', 'date', 'startTime', 'endTime', 'duration', 'startDate', 'endDate']);
    if (c.length) bloc.push(`trainingSessionSlots { ${c.join(' ')} }`);
  }

  if (a(schema, 'TrainingSession', 'invoices')) {
    const inv = champs(schema, 'Invoice',
      ['id', 'number', 'date', 'total', 'totalHt', 'totalTtc', 'prefix', 'paid', 'balance']);
    const sous = [];
    if (a(schema, 'Invoice', 'items')) {
      const it = tousScalaires(schema, 'InvoiceItem');
      if (it.length) sous.push(`items { ${it.join(' ')} }`);
    }
    const cleReglements = a(schema, 'Invoice', 'invoicePayments') ? 'invoicePayments'
      : a(schema, 'Invoice', 'payments') ? 'payments' : null;
    if (cleReglements) {
      const pa = tousScalaires(schema, 'InvoicePayment');
      if (pa.length) sous.push(`${cleReglements} { ${pa.join(' ')} }`);
    }
    if (inv.length || sous.length) bloc.push(`invoices { ${[...inv, ...sous].join(' ')} }`);
  }

  if (a(schema, 'TrainingSession', 'customers')) {
    const cu = champs(schema, 'Customer', ['id', 'name', 'type', 'specialPrice', 'crmStatus']);
    const sous = [];
    if (a(schema, 'Customer', 'company'))
      sous.push(`company { ${champs(schema, 'Company', ['id', 'name', 'city', 'zipCode', 'zipcode']).join(' ') || 'id name'} }`);
    // Le prix de vente est porté par le client de la session.
    if (a(schema, 'Customer', 'costs')) {
      const cc = tousScalaires(schema, 'CustomerCost');
      if (cc.length) sous.push(`costs { ${cc.join(' ')} }`);
    }
    if (a(schema, 'Customer', 'trainees')) {
      const ct = champs(schema, 'CustomerTrainee', ['id']);
      if (ct.length) sous.push(`trainees { ${ct.join(' ')} }`);
    }
    if (cu.length || sous.length) bloc.push(`customers { ${[...cu, ...sous].join(' ')} }`);
  }

  if (a(schema, 'TrainingSession', 'evaluationScore')) {
    const ev = tousScalaires(schema, 'EvaluationsScores');
    if (ev.length) bloc.push(`evaluationScore { ${ev.join(' ')} }`);
  }

  return `query Sessions($pagination: Pagination) {
  trainingSessions(pagination: $pagination) {
    ${bloc.join('\n    ')}
  }
}`;
}

/* -------------------------------------------------- récupération paginée */

// Le nom du champ « taille de page » varie d'une API à l'autre : on le
// découvre au lieu de le supposer. Chez Digiforma il s'agit de « size ».
let clePagination = null;
async function trouverClePagination() {
  if (clePagination) return clePagination;
  try {
    const champsEntree = await decouvrirEntree('Pagination');
    clePagination = ['size', 'perPage', 'pageSize', 'limit', 'first']
      .find((c) => champsEntree && champsEntree[c]) || 'size';
  } catch { clePagination = 'size'; }
  return clePagination;
}
const pagination = (page, taille) => ({ page, [clePagination || 'size']: taille });

async function recupererSessions({ max = 2000, onProgress } = {}) {
  const schema = await decouvrirSchema();
  await trouverClePagination();
  const requete = construireRequete(schema);
  const tout = [];
  for (let page = 0; tout.length < max; page++) {
    const d = await gql(requete, { pagination: pagination(page, PAGE) });
    const lot = (d && d.trainingSessions) || [];
    tout.push(...lot);
    if (onProgress) onProgress(tout.length);
    if (lot.length < PAGE) break;
    if (page > 60) break;   // garde-fou
  }
  return { sessions: tout, schema, requete };
}

/* ------------------------------------------------------- normalisation */

const nombre = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

// Montant réel d'un poste de coût. Digiforma stocke un tarif et un mode :
// « per_trainee » est un tarif par stagiaire, à multiplier par l'effectif.
// Ignorer le mode revient à diviser le coût par le nombre d'apprenants.
function montantCout(c, ctx) {
  if (!c) return 0;
  const base = nombre(c.cost ?? c.costIndependant ?? c.costIndividual ?? c.amount ?? c.value ?? 0);
  if (!base) return 0;
  const mode = String(c.costMode || '').toLowerCase();
  if (/trainee|stagiaire|participant|apprenant/.test(mode)) return base * (ctx.apprenants || 0);
  if (/hour|heure|horaire/.test(mode)) return base * (ctx.heures || 0);
  if (/day|jour/.test(mode)) return base * (ctx.jours || 0);
  return base;   // per_session, forfait, global…
}

function totalCouts(costs, ctx) {
  if (!Array.isArray(costs)) return 0;
  return costs.reduce((t, c) => t + montantCout(c, ctx), 0);
}

// Coût imputable au formateur : repéré sur le libellé du poste.
function coutFormateur(costs, ctx) {
  if (!Array.isArray(costs)) return 0;
  return costs.reduce((t, c) => {
    if (!c) return t;
    const lib = `${c.type || ''} ${c.description || ''} ${c.name || ''}`.toLowerCase();
    if (!/formateur|instructor|intervenant|trainer|training/.test(lib)) return t;
    return t + montantCout(c, ctx);
  }, 0);
}

function totalFactures(invoices) {
  if (!Array.isArray(invoices)) return { ht: 0, encaisse: 0, nb: 0 };
  let ht = 0, encaisse = 0;
  invoices.forEach((f) => {
    if (!f) return;
    if (f.totalHt != null) ht += nombre(f.totalHt);
    else if (Array.isArray(f.items) && f.items.length)
      ht += f.items.reduce((t, i) => t + (i.total != null ? nombre(i.total)
        : nombre(i.quantity) * nombre(i.unitPrice)), 0);
    else if (f.total != null) ht += nombre(f.total);
    const regl = f.invoicePayments || f.payments;
    if (Array.isArray(regl))
      encaisse += regl.reduce((t, p) => t + nombre(p && (p.amount ?? p.value ?? p.total)), 0);
  });
  return { ht, encaisse, nb: invoices.length };
}

// Durée totale en heures, déduite des créneaux.
function heuresTotales(slots) {
  if (!Array.isArray(slots) || !slots.length) return null;
  let h = 0, connus = 0;
  slots.forEach((s) => {
    if (!s) return;
    if (s.duration != null) { h += nombre(s.duration); connus++; return; }
    if (s.startTime && s.endTime) {
      const [h1, m1] = String(s.startTime).split(':').map(Number);
      const [h2, m2] = String(s.endTime).split(':').map(Number);
      if ([h1, m1, h2, m2].every(Number.isFinite)) {
        h += (h2 * 60 + m2 - h1 * 60 - m1) / 60; connus++;
      }
    }
  });
  return connus ? Math.round(h * 10) / 10 : null;
}

// Les noms de champs des scores varient. On retient la première valeur
// numérique plausible, en excluant les identifiants et les compteurs.
const EXCLUS = /^(id|count|nb|total_?count|questions?_?count)$/i;
function satisfaction(ev) {
  const liste = Array.isArray(ev) ? ev : ev ? [ev] : [];
  const vals = [];
  liste.forEach((e) => {
    if (!e || typeof e !== 'object') { const n = Number(e); if (Number.isFinite(n)) vals.push(n); return; }
    Object.entries(e).forEach(([k, v]) => {
      if (EXCLUS.test(k)) return;
      const n = Number(v);
      if (Number.isFinite(n) && n > 0 && n <= 100) vals.push(n);
    });
  });
  if (!vals.length) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

// Effectif maximal : « Limites d'effectif » du programme rattaché à la session.
function capacite(s) {
  const c = s && s.program && s.program.capacity;
  if (!c) return null;
  if (c.active === false || c.enabled === false) return null;
  const v = c.max ?? c.maxTrainees ?? c.maximum;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function nomClient(s) {
  const c = Array.isArray(s.customers) ? s.customers : [];
  for (const x of c) {
    if (x && x.company && x.company.name) return x.company.name;
    if (x && x.name) return x.name;
  }
  return '';
}

function nomFormateur(s) {
  const i = Array.isArray(s.instructors) ? s.instructors : [];
  if (!i.length) return '';
  return i.map((x) => (x && (x.lastname || x.firstname)) || '').filter(Boolean).join(', ');
}

// Traduit une session Digiforma dans la forme utilisée par la plateforme.
// Prix de vente porté par les clients de la session (CustomerCost).
function totalClients(customers, ctx) {
  if (!Array.isArray(customers)) return 0;
  return customers.reduce((t, cu) => {
    if (!cu) return t;
    if (Array.isArray(cu.costs) && cu.costs.length)
      return t + cu.costs.reduce((x, c) => x + montantCout(c, ctx), 0);
    return t + nombre(cu.specialPrice);
  }, 0);
}

function normaliser(s) {
  const apprenants = Array.isArray(s.trainees) ? s.trainees.length : 0;
  const heures = heuresTotales(s.trainingSessionSlots);
  const jours = Array.isArray(s.trainingSessionSlots)
    ? new Set(s.trainingSessionSlots.map((x) => x && x.date).filter(Boolean)).size : 0;
  const ctx = { apprenants, heures, jours };

  const { ht, encaisse, nb } = totalFactures(s.invoices);
  const htClients = totalClients(s.customers, ctx);
  const couts = totalCouts(s.costs, ctx);
  const date = (s.startDate || '').slice(0, 10);
  const modesCout = Array.isArray(s.costs)
    ? [...new Set(s.costs.map((c) => c && c.costMode).filter(Boolean))] : [];
  return {
    digiformaId: String(s.id),
    nom: s.name || s.code || '',
    code: s.code || '',
    date,
    mois: date.slice(0, 7),
    dateFin: (s.endDate || '').slice(0, 10),
    programme: (s.program && s.program.name) || '',
    client: nomClient(s),
    formateur: nomFormateur(s),
    nbParticipants: apprenants || null,
    placesMax: capacite(s),
    heures,
    jours: jours || null,
    montantHT: ht || htClients || null,
    sourceCA: ht ? 'factures' : htClients ? 'clients' : null,
    encaisse: encaisse || null,
    nbFactures: nb,
    coutVar: couts || null,
    cFormateur: coutFormateur(s.costs, ctx) || null,
    benefice: s.benefits != null ? nombre(s.benefits) : null,
    satisfaction: satisfaction(s.evaluationScore),
    etat: s.pipelineState || '',
    inter: !!s.inter,
    distanciel: !!s.remote,
    sousTraitance: !!s.contracted,
    archivee: !!s.frozenAt,
    lieu: s.placeName || s.place || s.address || '',
    modesCout,
    majDigiforma: s.updatedAt || null,
  };
}

module.exports = {
  gql, decouvrirSchema, decouvrirEntree, testerBlocs, construireRequete, trouverClePagination, pagination,
  recupererSessions, normaliser, DigiformaError, ENDPOINT,
};
