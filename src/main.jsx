// La couche de persistance DOIT être importée en premier :
// elle installe window.storage (branché sur /api/state) avant l'application.
import "./storage-server.js";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { EcranConnexion, Bandeaux, Compte } from "./Auth.jsx";

function Racine() {
  const [etat, setEtat] = useState({ phase: "verification", utilisateur: null });

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setEtat(d.authentifie
        ? { phase: "connecte", utilisateur: d.utilisateur }
        : { phase: "anonyme", utilisateur: null }))
      .catch(() => setEtat({ phase: "anonyme", utilisateur: null }));
  }, []);

  if (etat.phase === "verification") {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center",
        font: "500 14px Inter, system-ui, sans-serif", color: "#667085", background: "#f4f6f8" }}>
        Chargement…
      </div>
    );
  }

  if (etat.phase === "anonyme") {
    return <EcranConnexion onConnecte={(u) => setEtat({ phase: "connecte", utilisateur: u })} />;
  }

  return (
    <>
      <Bandeaux />
      <App />
      <Compte utilisateur={etat.utilisateur} />
    </>
  );
}

createRoot(document.getElementById("root")).render(<Racine />);
