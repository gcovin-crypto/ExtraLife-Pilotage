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
  constructor(message, details) { super(message); this.details = details; }
}

/* ------------------------------------------------------------- transport */

async function gql(query, variables = {}) {
  if (!TOKEN()) throw new DigiformaError('token_absent',
    'La variable DIGIFORMA_TOKEN n\'est pas renseignée.');

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

// Ne garde que les champs réellement présents dans le schéma distant.
const champs = (schema, type, liste) => liste.filter((c) => a(schema, type, c));

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
        ['min', 'max', 'minTrainees', 'maxTrainees', 'minimum', 'maximum', 'enabled']);
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
      ['id', 'cost', 'amount', 'value', 'type', 'name', 'title', 'label', 'quantity', 'unitPrice']);
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
      const it = champs(schema, 'InvoiceItem', ['id', 'quantity', 'unitPrice', 'total', 'vat', 'name', 'title']);
      if (it.length) sous.push(`items { ${it.join(' ')} }`);
    }
    if (a(schema, 'Invoice', 'payments')) {
      const pa = champs(schema, 'InvoicePayment', ['id', 'amount', 'date', 'mode']);
      if (pa.length) sous.push(`payments { ${pa.join(' ')} }`);
    }
    if (inv.length || sous.length) bloc.push(`invoices { ${[...inv, ...sous].join(' ')} }`);
  }

  if (a(schema, 'TrainingSession', 'customers')) {
    const cu = champs(schema, 'Customer', ['id', 'name', 'type']);
    const sous = [];
    if (a(schema, 'Customer', 'company'))
      sous.push(`company { ${champs(schema, 'Company', ['id', 'name', 'city', 'zipCode', 'zipcode']).join(' ') || 'id name'} }`);
    if (cu.length || sous.length) bloc.push(`customers { ${[...cu, ...sous].join(' ')} }`);
  }

  if (a(schema, 'TrainingSession', 'evaluationScore')) {
    const ev = champs(schema, 'EvaluationsScores', ['score', 'average', 'value', 'type', 'name']);
    if (ev.length) bloc.push(`evaluationScore { ${ev.join(' ')} }`);
  }

  return `query Sessions($pagination: Pagination) {
  trainingSessions(pagination: $pagination) {
    ${bloc.join('\n    ')}
  }
}`;
}

/* -------------------------------------------------- récupération paginée */

async function recupererSessions({ max = 2000, onProgress } = {}) {
  const schema = await decouvrirSchema();
  const requete = construireRequete(schema);
  const tout = [];
  for (let page = 0; tout.length < max; page++) {
    const d = await gql(requete, { pagination: { page, perPage: PAGE } });
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

// Somme des postes de coût, en tolérant plusieurs noms de champ possibles.
function totalCouts(costs) {
  if (!Array.isArray(costs)) return 0;
  return costs.reduce((t, c) => {
    if (!c) return t;
    const v = c.cost ?? c.amount ?? c.value
      ?? (c.quantity != null && c.unitPrice != null ? nombre(c.quantity) * nombre(c.unitPrice) : 0);
    return t + nombre(v);
  }, 0);
}

// Coût imputable au formateur : repéré sur le libellé du poste.
function coutFormateur(costs) {
  if (!Array.isArray(costs)) return 0;
  return costs.reduce((t, c) => {
    const lib = `${(c && (c.type || c.name || c.title || c.label)) || ''}`.toLowerCase();
    if (!/formateur|instructor|intervenant/.test(lib)) return t;
    const v = c.cost ?? c.amount ?? c.value ?? 0;
    return t + nombre(v);
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
    if (Array.isArray(f.payments))
      encaisse += f.payments.reduce((t, p) => t + nombre(p && p.amount), 0);
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

function satisfaction(ev) {
  if (!Array.isArray(ev) || !ev.length) return null;
  const vals = ev.map((e) => e && (e.score ?? e.average ?? e.value))
    .map(Number).filter(Number.isFinite);
  if (!vals.length) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

// Effectif maximal : « Limites d'effectif » du programme rattaché à la session.
function capacite(s) {
  const c = s && s.program && s.program.capacity;
  if (!c) return null;
  if (c.enabled === false) return null;
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
function normaliser(s) {
  const { ht, encaisse, nb } = totalFactures(s.invoices);
  const couts = totalCouts(s.costs);
  const heures = heuresTotales(s.trainingSessionSlots);
  const date = (s.startDate || '').slice(0, 10);
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
    nbParticipants: Array.isArray(s.trainees) ? s.trainees.length : null,
    placesMax: capacite(s),
    heures,
    montantHT: ht || null,
    encaisse: encaisse || null,
    nbFactures: nb,
    coutVar: couts || null,
    cFormateur: coutFormateur(s.costs) || null,
    benefice: s.benefits != null ? nombre(s.benefits) : null,
    satisfaction: satisfaction(s.evaluationScore),
    etat: s.pipelineState || '',
    inter: !!s.inter,
    distanciel: !!s.remote,
    sousTraitance: !!s.contracted,
    archivee: !!s.frozenAt,
    lieu: s.placeName || s.place || s.address || '',
    majDigiforma: s.updatedAt || null,
  };
}

module.exports = {
  gql, decouvrirSchema, construireRequete, recupererSessions, normaliser,
  DigiformaError, ENDPOINT,
};
