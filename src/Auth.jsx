import React, { useEffect, useState } from "react";

const ROUGE = "#e02436";
const TEAL = "#00b4bc";

const api = (url, options = {}) =>
  fetch(url, { credentials: "include", headers: { "Content-Type": "application/json" }, ...options });

const css = `
.auth-wrap{min-height:100vh;display:grid;place-items:center;background:#f4f6f8;
  font-family:Inter,system-ui,sans-serif;padding:24px}
.auth-card{width:100%;max-width:400px;background:#fff;border:1px solid #e6e9ee;border-radius:16px;
  padding:32px;box-shadow:0 1px 3px rgba(16,24,40,.06)}
.auth-logo{font-family:'Plus Jakarta Sans',Inter,sans-serif;font-weight:800;font-size:20px;
  letter-spacing:-.02em;margin:0 0 4px}
.auth-sub{color:#667085;font-size:13px;margin:0 0 24px}
.auth-lbl{display:block;font-size:12.5px;font-weight:600;color:#344054;margin:0 0 6px}
.auth-inp{width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #d0d5dd;border-radius:9px;
  font-size:14px;font-family:inherit;background:#fff;margin:0 0 16px}
.auth-inp:focus{outline:none;border-color:${TEAL};box-shadow:0 0 0 3px rgba(0,180,188,.14)}
.auth-btn{width:100%;padding:11px;border:0;border-radius:9px;background:${ROUGE};color:#fff;
  font-size:14px;font-weight:600;font-family:inherit;cursor:pointer}
.auth-btn:disabled{opacity:.55;cursor:default}
.auth-err{background:#fef3f2;border:1px solid #fecdca;color:#b42318;font-size:13px;
  padding:9px 12px;border-radius:8px;margin:0 0 16px}
.auth-note{color:#98a2b3;font-size:11.5px;text-align:center;margin:18px 0 0;line-height:1.5}

.els-bar{position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;gap:10px;align-items:center;
  padding:9px 16px;font:500 13px Inter,system-ui,sans-serif;color:#7a2e0e;background:#fffaeb;
  border-bottom:1px solid #fedf89}
.els-bar.err{color:#b42318;background:#fef3f2;border-bottom-color:#fecdca}
.els-bar button{margin-left:auto;border:1px solid currentColor;background:transparent;color:inherit;
  border-radius:7px;padding:5px 11px;font:600 12.5px inherit;cursor:pointer;font-family:Inter,sans-serif}

.els-compte{position:fixed;right:16px;bottom:16px;z-index:9998;font-family:Inter,system-ui,sans-serif}
.els-compte>button{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e6e9ee;
  border-radius:999px;padding:7px 14px 7px 8px;font:600 12.5px Inter,sans-serif;color:#344054;
  cursor:pointer;box-shadow:0 2px 8px rgba(16,24,40,.1)}
.els-ini{width:24px;height:24px;border-radius:50%;background:${TEAL};color:#fff;display:grid;
  place-items:center;font-size:11px;font-weight:700}
.els-pop{position:absolute;right:0;bottom:44px;width:320px;background:#fff;border:1px solid #e6e9ee;
  border-radius:13px;box-shadow:0 8px 28px rgba(16,24,40,.14);padding:16px;max-height:70vh;overflow:auto}
.els-pop h4{margin:0 0 3px;font-size:14px;font-weight:700;color:#101828}
.els-pop p.m{margin:0 0 14px;font-size:12px;color:#667085}
.els-pop hr{border:0;border-top:1px solid #eef0f4;margin:14px 0}
.els-pop label{display:block;font-size:11.5px;font-weight:600;color:#475467;margin:0 0 5px}
.els-pop input,.els-pop select{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #d0d5dd;
  border-radius:8px;font-size:13px;font-family:inherit;margin:0 0 10px}
.els-pop button.act{width:100%;padding:9px;border:0;border-radius:8px;background:#101828;color:#fff;
  font:600 13px Inter,sans-serif;cursor:pointer}
.els-pop button.ghost{width:100%;padding:9px;border:1px solid #d0d5dd;border-radius:8px;background:#fff;
  color:#344054;font:600 13px Inter,sans-serif;cursor:pointer;margin-top:8px}
.els-u{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #f2f4f7;font-size:12.5px}
.els-u .n{font-weight:600;color:#344054}
.els-u .r{margin-left:auto;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;
  color:#667085;background:#f2f4f7;border-radius:5px;padding:2px 6px}
.els-ok{color:#027a48;font-size:12px;margin:0 0 10px}
.els-ko{color:#b42318;font-size:12px;margin:0 0 10px}
`;

/* ------------------------------------------------------------- connexion */

export function EcranConnexion({ onConnecte }) {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [err, setErr] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const soumettre = async () => {
    setErr(""); setEnvoi(true);
    try {
      const r = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password: mdp }) });
      if (!r.ok) { setErr("Adresse ou mot de passe incorrect."); return; }
      const { utilisateur } = await r.json();
      onConnecte(utilisateur);
    } catch { setErr("Serveur injoignable. Réessayez dans un instant."); }
    finally { setEnvoi(false); }
  };

  return (
    <div className="auth-wrap">
      <style>{css}</style>
      <div className="auth-card">
        <h1 className="auth-logo">
          <span style={{ color: ROUGE }}>Extra</span><span style={{ color: TEAL }}>Life</span> Formation
        </h1>
        <p className="auth-sub">Pilotage commercial et financier</p>
        {err && <div className="auth-err">{err}</div>}
        <label className="auth-lbl" htmlFor="a-email">Adresse e-mail</label>
        <input id="a-email" className="auth-inp" type="email" autoComplete="username" value={email}
          onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && soumettre()} />
        <label className="auth-lbl" htmlFor="a-mdp">Mot de passe</label>
        <input id="a-mdp" className="auth-inp" type="password" autoComplete="current-password" value={mdp}
          onChange={(e) => setMdp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && soumettre()} />
        <button className="auth-btn" onClick={soumettre} disabled={envoi || !email || !mdp}>
          {envoi ? "Connexion…" : "Se connecter"}
        </button>
        <p className="auth-note">Accès réservé à l'équipe ExtraLife Formation.<br />
          Mot de passe oublié : contactez un administrateur.</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- bandeaux sync */

export function Bandeaux() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    const conflit = (e) => setMsg({
      type: "err",
      txt: `Vos dernières modifications n'ont pas été enregistrées : ${e.detail.auteur} a modifié les données entre-temps.`,
      action: "Recharger",
    });
    const distant = () => setMsg({
      type: "warn",
      txt: "Un autre membre de l'équipe vient d'enregistrer des modifications.",
      action: "Recharger",
    });
    const lecture = () => setMsg({ type: "warn", txt: "Votre compte est en lecture seule : les modifications ne sont pas enregistrées." });
    const deco = () => setMsg({ type: "err", txt: "Session expirée.", action: "Se reconnecter" });
    window.addEventListener("els:conflit", conflit);
    window.addEventListener("els:distant-modifie", distant);
    window.addEventListener("els:lecture-seule", lecture);
    window.addEventListener("els:deconnecte", deco);
    return () => {
      window.removeEventListener("els:conflit", conflit);
      window.removeEventListener("els:distant-modifie", distant);
      window.removeEventListener("els:lecture-seule", lecture);
      window.removeEventListener("els:deconnecte", deco);
    };
  }, []);
  if (!msg) return null;
  return (
    <div className={`els-bar ${msg.type === "err" ? "err" : ""}`}>
      <span>{msg.txt}</span>
      {msg.action
        ? <button onClick={() => window.location.reload()}>{msg.action}</button>
        : <button onClick={() => setMsg(null)}>Fermer</button>}
    </div>
  );
}

/* ----------------------------------------------------------- mon compte */

export function Compte({ utilisateur }) {
  const [ouvert, setOuvert] = useState(false);
  const initiales = (utilisateur.nom || utilisateur.email).split(/[\s@.]+/).slice(0, 2)
    .map((s) => s[0]).join("").toUpperCase();

  return (
    <div className="els-compte">
      {ouvert && <Panneau utilisateur={utilisateur} fermer={() => setOuvert(false)} />}
      <button onClick={() => setOuvert((v) => !v)}>
        <span className="els-ini">{initiales}</span>
        {utilisateur.nom}
      </button>
    </div>
  );
}

function Panneau({ utilisateur, fermer }) {
  const [ancien, setAncien] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [info, setInfo] = useState(null);
  const [users, setUsers] = useState(null);
  const [nv, setNv] = useState({ email: "", nom: "", password: "", role: "editeur" });
  const admin = utilisateur.role === "admin";

  useEffect(() => {
    if (!admin) return;
    api("/api/users").then((r) => r.ok && r.json().then(setUsers)).catch(() => {});
  }, [admin]);

  const changerMdp = async () => {
    setInfo(null);
    const r = await api("/api/auth/password", { method: "POST", body: JSON.stringify({ ancien, nouveau }) });
    if (r.ok) { setInfo({ ok: "Mot de passe modifié." }); setAncien(""); setNouveau(""); }
    else {
      const e = await r.json().catch(() => ({}));
      setInfo({ ko: e.error === "mot_de_passe_trop_court" ? "8 caractères minimum." : "Ancien mot de passe incorrect." });
    }
  };

  const creer = async () => {
    setInfo(null);
    const r = await api("/api/users", { method: "POST", body: JSON.stringify(nv) });
    if (r.ok) {
      setInfo({ ok: `Compte créé pour ${nv.email}.` });
      setNv({ email: "", nom: "", password: "", role: "editeur" });
      api("/api/users").then((x) => x.json()).then(setUsers);
    } else {
      const e = await r.json().catch(() => ({}));
      setInfo({ ko: e.error === "mot_de_passe_trop_court" ? "8 caractères minimum." : "Création impossible (adresse déjà utilisée ?)." });
    }
  };

  const deconnexion = async () => {
    await api("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="els-pop">
      <h4>{utilisateur.nom}</h4>
      <p className="m">{utilisateur.email} · {utilisateur.role}</p>
      {info?.ok && <p className="els-ok">{info.ok}</p>}
      {info?.ko && <p className="els-ko">{info.ko}</p>}

      <label>Ancien mot de passe</label>
      <input type="password" value={ancien} onChange={(e) => setAncien(e.target.value)} />
      <label>Nouveau mot de passe</label>
      <input type="password" value={nouveau} onChange={(e) => setNouveau(e.target.value)} />
      <button className="act" onClick={changerMdp} disabled={!ancien || !nouveau}>Changer le mot de passe</button>

      {admin && (
        <>
          <hr />
          <h4>Comptes de l'équipe</h4>
          <p className="m">{users ? `${users.length} compte(s)` : "Chargement…"}</p>
          {users?.map((u) => (
            <div className="els-u" key={u.id}>
              <span className="n">{u.nom}</span>
              <span className="r">{u.role}</span>
            </div>
          ))}
          <div style={{ height: 12 }} />
          <label>Nouveau compte</label>
          <input placeholder="Adresse e-mail" value={nv.email} onChange={(e) => setNv({ ...nv, email: e.target.value })} />
          <input placeholder="Nom complet" value={nv.nom} onChange={(e) => setNv({ ...nv, nom: e.target.value })} />
          <input type="password" placeholder="Mot de passe provisoire" value={nv.password}
            onChange={(e) => setNv({ ...nv, password: e.target.value })} />
          <select value={nv.role} onChange={(e) => setNv({ ...nv, role: e.target.value })}>
            <option value="admin">Administrateur — tout, dont les comptes</option>
            <option value="editeur">Éditeur — saisie et modification</option>
            <option value="lecteur">Lecteur — consultation seule</option>
          </select>
          <button className="act" onClick={creer} disabled={!nv.email || !nv.password}>Créer le compte</button>
        </>
      )}

      <hr />
      <button className="ghost" onClick={deconnexion}>Se déconnecter</button>
      <button className="ghost" onClick={fermer}>Fermer</button>
    </div>
  );
}
