// =====================================================================
//  Persistance serveur partagée.
//  Expose la même interface window.storage que l'ancien polyfill
//  localStorage, mais lit et écrit sur /api/state. App.jsx reste inchangé.
//
//  Verrou optimiste : chaque écriture envoie la version connue. Si un autre
//  membre de l'équipe a enregistré entre-temps, le serveur répond 409 et
//  l'événement « els:conflit » est émis (bandeau d'avertissement).
// =====================================================================

const STORE_KEY = 'extralife:state';

let version = null;        // version connue du serveur
let dernierAuteur = null;
let enAttente = false;

const emit = (nom, detail) => window.dispatchEvent(new CustomEvent(nom, { detail }));

async function api(url, options = {}) {
  const r = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return r;
}

async function chargerEtat() {
  const r = await api('/api/state');
  if (r.status === 401) { emit('els:deconnecte'); return null; }
  if (!r.ok) throw new Error(`lecture impossible (${r.status})`);
  const s = await r.json();
  version = s.version;
  dernierAuteur = s.updatedBy;
  emit('els:charge', { version, updatedAt: s.updatedAt, updatedBy: s.updatedBy });
  return s.data;
}

async function enregistrerEtat(value) {
  if (version == null) await chargerEtat();   // jamais écrire sans version connue
  const r = await api('/api/state', {
    method: 'PUT',
    body: JSON.stringify({ data: value, version }),
  });
  if (r.status === 401) { emit('els:deconnecte'); return false; }
  if (r.status === 403) { emit('els:lecture-seule'); return false; }
  if (r.status === 409) {
    const c = await r.json();
    emit('els:conflit', {
      auteur: c.current?.updatedBy || 'un autre utilisateur',
      quand: c.current?.updatedAt || null,
    });
    return false;
  }
  if (!r.ok) throw new Error(`enregistrement impossible (${r.status})`);
  const s = await r.json();
  version = s.version;
  dernierAuteur = s.updatedBy;
  emit('els:enregistre', { version, updatedAt: s.updatedAt });
  return true;
}

// Sonde périodique : prévient si quelqu'un d'autre a enregistré.
function surveiller(intervalleMs = 45000) {
  setInterval(async () => {
    if (document.hidden || enAttente || version == null) return;
    try {
      const r = await api('/api/health');
      if (!r.ok) return;
      const h = await r.json();
      if (typeof h.version === 'number' && h.version > version) {
        emit('els:distant-modifie', { versionDistante: h.version, versionLocale: version, auteur: dernierAuteur });
      }
    } catch { /* réseau momentanément indisponible */ }
  }, intervalleMs);
}

window.storage = {
  get: async (key) => {
    if (key !== STORE_KEY) return null;   // clés héritées : plus de données locales
    const value = await chargerEtat();
    return value == null ? null : { key, value };
  },
  set: async (key, value) => {
    if (key !== STORE_KEY) return { key, value };
    enAttente = true;
    try { await enregistrerEtat(value); } finally { enAttente = false; }
    return { key, value };
  },
  delete: async () => ({ deleted: false }),   // suppression désactivée côté client
  list: async (prefix = '') => ({ keys: STORE_KEY.startsWith(prefix) ? [STORE_KEY] : [], prefix }),
};

window.elsEtat = {
  version: () => version,
  recharger: chargerEtat,
  surveiller,
};

surveiller();
