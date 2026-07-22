import { useState, useMemo, useRef, useEffect, Fragment } from "react";
import {
  LayoutDashboard, KanbanSquare, Wallet, TrendingUp, Plus, X, Search,
  Phone, Mail, Building2, CalendarClock, Bell, Target, ArrowUpRight,
  ArrowDownRight, Trash2, Pencil, StickyNote, Filter, ChevronRight,
  CircleDollarSign, Percent, Users, Flame, Award, AlertTriangle,
  CheckCircle2, Clock, FileText, Settings2, Crown, Layers, Banknote,
  CalendarDays, CalendarRange, Ban, PhoneIncoming, BarChart3, Calculator,
  RotateCcw, Cloud, CloudOff,
  GraduationCap, ShieldCheck, Download, Upload, Megaphone, FileSpreadsheet, UserCog,
  Map as MapIcon, RefreshCw, UserPlus, MapPin,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Legend, ComposedChart, Area, ReferenceLine,
} from "recharts";

/* ============================================================= *
 *  DESIGN SYSTEM
 * ============================================================= */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600;700&display=swap');

:root{
  --bg:#edf1f0; --surface:#ffffff; --surface-2:#f6faf9; --surface-3:#eef4f3;
  --ink:#002423; --ink-2:#4a5b58; --ink-3:#8a9b9a; --line:#e2e8e6; --line-2:#edf1f0;
  --brand:#e02436; --brand-700:#b81c2d; --brand-50:#fdeaec; --brand-100:#f9ccd1;
  --gold:#b5760a; --gold-50:#fdf3df;
  --st-new:#00b4bc;   --st-new-bg:#e3f6f7;
  --st-quote:#ef7507; --st-quote-bg:#fdeede;
  --st-sign:#b5760a;  --st-sign-bg:#fdf3df;
  --st-won:#029393;   --st-won-bg:#e0f3f3;
  --st-lost:#e02436;  --st-lost-bg:#fdeaec;
  --st-na:#8a9b9a;    --st-na-bg:#eef2f1;
  --shadow:0 1px 2px rgba(16,25,43,.04), 0 1px 3px rgba(16,25,43,.06);
  --shadow-lg:0 12px 32px -8px rgba(16,25,43,.18), 0 4px 12px -4px rgba(16,25,43,.10);
  --radius:14px;
}
*{box-sizing:border-box}
.of-root{font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:var(--bg);
  min-height:100vh;-webkit-font-smoothing:antialiased;line-height:1.45;font-size:14px;}
.of-root h1,.of-root h2,.of-root h3,.of-root h4{font-family:'Plus Jakarta Sans',sans-serif;
  margin:0;letter-spacing:-.01em;color:var(--ink);}
.num{font-family:'JetBrains Mono',ui-monospace,monospace;font-variant-numeric:tabular-nums;
  font-feature-settings:"tnum";letter-spacing:-.02em;}

/* shell */
.shell{display:flex;min-height:100vh}
.sidebar{width:240px;flex-shrink:0;background:#002423;color:#b9c4c2;
  display:flex;flex-direction:column;position:sticky;top:0;height:100vh;
  border-right:1px solid rgba(255,255,255,.04)}
.brand{padding:22px 20px 18px;display:flex;align-items:center;gap:11px;
  border-bottom:1px solid rgba(255,255,255,.06)}
.brand-logo{width:36px;height:36px;border-radius:10px;flex-shrink:0;
  background:#002423;display:grid;place-items:center;
  box-shadow:0 4px 12px rgba(0,36,35,.45)}
.brand-name{font-family:'Plus Jakarta Sans';font-weight:800;color:#fff;font-size:15px;line-height:1.1}
.brand-sub{font-size:11px;color:#6f8582;letter-spacing:.02em;margin-top:1px}
.nav{padding:14px 12px;display:flex;flex-direction:column;gap:3px;flex:1}
.nav-label{font-size:10.5px;text-transform:uppercase;letter-spacing:.09em;color:#5f7370;
  padding:8px 12px 6px;font-weight:600}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;
  cursor:pointer;color:#9fb0ad;font-weight:500;font-size:13.5px;transition:.13s;border:none;
  background:transparent;width:100%;text-align:left}
.nav-item:hover{background:rgba(255,255,255,.05);color:#eef4f3}
.nav-item.active{background:linear-gradient(90deg,rgba(224,36,54,.18),rgba(224,36,54,.05));
  color:#fff;box-shadow:inset 2px 0 0 #e02436}
.nav-item.active svg{color:#ff6671}
.side-foot{padding:14px 16px;border-top:1px solid rgba(255,255,255,.06);font-size:11px;color:#6f8582}

.main{flex:1;min-width:0;display:flex;flex-direction:column}
.topbar{background:var(--surface);border-bottom:1px solid var(--line);padding:16px 28px;
  display:flex;align-items:center;justify-content:space-between;gap:16px;position:sticky;top:0;z-index:20}
.topbar h1{font-size:19px;font-weight:700}
.topbar .sub{font-size:12.5px;color:var(--ink-3);margin-top:2px}
.content{padding:24px 28px 60px;max-width:1340px;width:100%;margin:0 auto}

/* generic */
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);
  box-shadow:var(--shadow)}
.card-pad{padding:18px}
.row{display:flex;gap:16px}.col{display:flex;flex-direction:column}
.grid{display:grid;gap:16px}
.muted{color:var(--ink-2)}.faint{color:var(--ink-3)}
.eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-3);font-weight:600}
.btn{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;border-radius:10px;
  font-weight:600;font-size:13px;cursor:pointer;border:1px solid var(--line);background:var(--surface);
  color:var(--ink);transition:.13s;font-family:inherit}
.btn:hover{background:var(--surface-3);border-color:#d8e0de}
.btn-primary{background:var(--brand);border-color:var(--brand);color:#fff;
  box-shadow:0 2px 8px rgba(14,124,102,.28)}
.btn-primary:hover{background:var(--brand-700);border-color:var(--brand-700)}
.btn-sm{padding:6px 11px;font-size:12px;border-radius:8px}
.btn-icon{padding:8px;border-radius:9px}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;
  font-size:11.5px;font-weight:600;line-height:1.4;white-space:nowrap}
.dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.input,.select,textarea.input{width:100%;padding:9px 11px;border:1px solid var(--line);
  border-radius:9px;font-size:13.5px;font-family:inherit;background:var(--surface);color:var(--ink);
  transition:.13s;outline:none}
.input:focus,.select:focus,textarea.input:focus{border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-50)}
.field{display:flex;flex-direction:column;gap:5px}
.field label{font-size:12px;font-weight:600;color:var(--ink-2)}
textarea.input{resize:vertical;min-height:64px;line-height:1.5}
.cell-input{border-color:transparent;background:transparent;border-radius:7px}
.cell-input:hover{border-color:var(--line);background:var(--surface)}
.cell-input:focus{border-color:var(--brand);background:var(--surface);box-shadow:0 0 0 3px var(--brand-50)}

/* kpi */
.kpi{position:relative;overflow:hidden}
.kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--accent,var(--brand))}
.kpi-label{font-size:12px;color:var(--ink-2);font-weight:600;display:flex;align-items:center;gap:7px}
.kpi-val{font-size:27px;font-weight:700;margin-top:9px;line-height:1}
.kpi-sub{font-size:12px;color:var(--ink-3);margin-top:8px;display:flex;align-items:center;gap:5px}
.trend-up{color:var(--st-won)}.trend-down{color:var(--st-lost)}
.ico-chip{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex-shrink:0}

/* table */
table.tbl{width:100%;border-collapse:collapse;font-size:13px}
.tbl th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em;
  color:var(--ink-3);font-weight:600;padding:11px 14px;border-bottom:1px solid var(--line);
  position:sticky;top:0;background:var(--surface-2)}
.tbl td{padding:12px 14px;border-bottom:1px solid var(--line-2);vertical-align:middle}
.tbl tbody tr:hover{background:var(--surface-2)}
.tbl tbody tr:last-child td{border-bottom:none}
.month-detail:hover{background:transparent}
.tbl-inner{font-size:12.5px;background:var(--surface-2);box-shadow:inset 3px 0 0 var(--brand)}
.tbl-inner th{padding:8px 14px;background:var(--surface-3);position:static;font-size:10px}
.tbl-inner td{padding:9px 14px;border-bottom:1px solid var(--line-2)}
.tbl-inner tbody tr:hover{background:var(--surface-3)}
.tbl-inner tbody tr:last-child td{border-bottom:none}
.t-right{text-align:right}.t-center{text-align:center}

/* kanban */
.board{display:grid;grid-template-columns:repeat(5,minmax(220px,1fr));gap:14px;align-items:start}
.col-k{background:var(--surface-3);border-radius:13px;border:1px solid var(--line);
  display:flex;flex-direction:column;min-height:120px;transition:.15s}
.col-k.over{background:var(--brand-50);border-color:var(--brand-100);box-shadow:inset 0 0 0 2px var(--brand-100)}
.col-head{padding:12px 13px 10px;display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid var(--line)}
.col-title{display:flex;align-items:center;gap:8px;font-weight:700;font-size:13px;font-family:'Plus Jakarta Sans'}
.col-count{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:#fff;
  border:1px solid var(--line)}
.col-sum{padding:6px 13px;font-size:11.5px;color:var(--ink-2);border-bottom:1px solid var(--line-2)}
.col-body{padding:10px;display:flex;flex-direction:column;gap:9px;min-height:60px}
.pcard{background:var(--surface);border:1px solid var(--line);border-radius:11px;padding:12px;
  cursor:grab;box-shadow:var(--shadow);transition:.13s;border-left:3px solid var(--accent,var(--brand))}
.pcard:hover{box-shadow:var(--shadow-lg);transform:translateY(-1px)}
.pcard:active{cursor:grabbing}
.pcard.dragging{opacity:.4;transform:rotate(1.5deg) scale(.98)}
.pcard-co{font-weight:700;font-size:13.5px;display:flex;align-items:center;justify-content:space-between;gap:6px}
.pcard-ct{font-size:12px;color:var(--ink-2);margin-top:2px}
.pcard-meta{display:flex;align-items:center;justify-content:space-between;margin-top:10px;gap:8px}
.proba-bar{height:5px;background:var(--surface-3);border-radius:99px;margin-top:9px;overflow:hidden}
.proba-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--brand),#ff6671)}
.tag{font-size:10.5px;padding:2px 7px;border-radius:6px;background:var(--surface-3);
  color:var(--ink-2);font-weight:600;border:1px solid var(--line)}

/* drawer */
.scrim{position:fixed;inset:0;background:rgba(16,25,43,.45);z-index:50;display:flex;
  justify-content:flex-end;backdrop-filter:blur(2px);animation:fade .2s}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes slide{from{transform:translateX(28px);opacity:.6}to{transform:none;opacity:1}}
.drawer{width:480px;max-width:94vw;background:var(--bg);height:100vh;overflow-y:auto;
  box-shadow:-12px 0 40px rgba(16,25,43,.22);animation:slide .22s}
.drawer-head{position:sticky;top:0;background:var(--surface);border-bottom:1px solid var(--line);
  padding:18px 22px;display:flex;align-items:flex-start;justify-content:space-between;z-index:2}
.drawer-body{padding:18px 22px 60px;display:flex;flex-direction:column;gap:16px}
.note{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:10px 12px;font-size:12.5px}
.note-date{font-size:11px;color:var(--ink-3);margin-bottom:3px;font-weight:600}

/* modal */
.modal-scrim{position:fixed;inset:0;background:rgba(16,25,43,.45);z-index:60;display:grid;
  place-items:center;padding:20px;backdrop-filter:blur(2px);animation:fade .2s}
.modal{background:var(--surface);border-radius:16px;width:560px;max-width:100%;max-height:90vh;
  overflow-y:auto;box-shadow:var(--shadow-lg)}
.modal-lg{width:680px}
.modal-head{padding:18px 22px;border-bottom:1px solid var(--line);display:flex;
  align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--surface)}
.modal-body{padding:20px 22px}
.modal-foot{padding:16px 22px;border-top:1px solid var(--line);display:flex;justify-content:flex-end;
  gap:10px;position:sticky;bottom:0;background:var(--surface)}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.field-c2{grid-column:span 2}
.sec-h{font-weight:700}

/* misc */
.section-title{display:flex;align-items:center;justify-content:space-between;margin:4px 0 14px}
.section-title h2{font-size:16px;font-weight:700}
.pill-tab{display:inline-flex;background:var(--surface-3);border-radius:10px;padding:3px;gap:2px}
.pill-tab button{border:none;background:transparent;padding:7px 14px;border-radius:8px;font-size:12.5px;
  font-weight:600;cursor:pointer;color:var(--ink-2);font-family:inherit;transition:.12s}
.pill-tab button.on{background:var(--surface);color:var(--ink);box-shadow:var(--shadow)}
.bar-track{height:7px;background:var(--surface-3);border-radius:99px;overflow:hidden;flex:1}
.gauge-wrap{display:flex;flex-direction:column;align-items:center;gap:6px}
.empty{padding:34px;text-align:center;color:var(--ink-3);font-size:13px}
.acq-row{display:flex;align-items:center;gap:10px;padding:8px 6px;border-radius:9px;cursor:pointer;transition:.12s}
.acq-row:hover{background:var(--surface-2)}
.boot{position:fixed;inset:0;display:grid;place-items:center;background:var(--bg)}
.boot-card{display:flex;flex-direction:column;align-items:center;gap:14px;color:var(--ink-2)}
.spin{width:30px;height:30px;border-radius:50%;border:3px solid var(--line);border-top-color:var(--brand);animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.save-badge{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;padding:5px 10px;border-radius:999px;border:1px solid var(--line);background:var(--surface)}
.save-badge .sdot{width:7px;height:7px;border-radius:50%}
.rank-badge{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;font-weight:700;
  font-size:12px;flex-shrink:0}
.scroll-x{overflow-x:auto}
.recharts-cartesian-axis-tick text{font-size:11px;fill:var(--ink-3);font-family:'JetBrains Mono'}
.planif-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:16px;align-items:start}
.fo-card{border:1px solid var(--line);border-radius:11px;padding:11px 12px;margin-bottom:8px;background:var(--surface)}
.fo-card.match{border-color:var(--brand)55;box-shadow:0 0 0 2px var(--brand)12}
.fo-card .fo-top{display:flex;align-items:center;gap:8px;margin-bottom:5px}
.fo-card .fo-nom{font-weight:700;font-size:13.5px}
.fo-card .fo-meta{font-size:11.5px;color:var(--ink-3);line-height:1.55}
.row-sel{background:var(--brand-50) !important}
.row-clic{cursor:pointer}
@media (max-width:1180px){.planif-grid{grid-template-columns:1fr}}
@media (max-width:1080px){.board{grid-template-columns:repeat(5,minmax(200px,1fr));overflow-x:auto}
  .form-grid{grid-template-columns:1fr}}
@media (max-width:760px){.sidebar{display:none}.content{padding:16px}}
`;

/* ============================================================= *
 *  RÉFÉRENTIELS
 * ============================================================= */
const STAGES = [
  { id: "nouveau", label: "Nouveau",        color: "var(--st-new)",   bg: "var(--st-new-bg)" },
  { id: "devis",   label: "Devis en cours", color: "var(--st-quote)", bg: "var(--st-quote-bg)" },
  { id: "signer",  label: "Devrait signer", color: "var(--st-sign)",  bg: "var(--st-sign-bg)" },
  { id: "gagne",   label: "Gagné",          color: "var(--st-won)",   bg: "var(--st-won-bg)" },
  { id: "perdu",   label: "Perdu",          color: "var(--st-lost)",  bg: "var(--st-lost-bg)" },
  { id: "npertinent", label: "Non pertinent", color: "var(--st-na)",  bg: "var(--st-na-bg)" },
];
const stageById = (id) => STAGES.find((s) => s.id === id) || STAGES[0];
// Étapes "fermées" (hors pipeline actif) : ni à relancer, ni comptées en pipeline ouvert
const CLOSED_STAGES = ["gagne", "perdu", "npertinent"];
const isOpen = (p) => !CLOSED_STAGES.includes(p.stage);

// Catalogue formations (coûts unitaires directs calés sur l'historique réel)
const FORMATIONS = [
  { id: "afgsu2", code: "AFGSU 2",  nom: "Gestes & soins d'urgence niv.2", color: "#e02436", dureeJours: 3, coutFormateurJour: 420, coutSupportParticipant: 28, coutSalleJour: 60, capacite: 12 },
  { id: "mac",    code: "MAC",      nom: "Maintien & actualisation des compétences", color: "#00b4bc", dureeJours: 1, coutFormateurJour: 380, coutSupportParticipant: 12, coutSalleJour: 40, capacite: 12 },
  { id: "macsst", code: "MAC SST",  nom: "MAC Sauveteur Secouriste du Travail", color: "#ef7507", dureeJours: 1, coutFormateurJour: 340, coutSupportParticipant: 10, coutSalleJour: 30, capacite: 10 },
  { id: "sstin",  code: "SST IN",   nom: "SST Initial", color: "#b5760a", dureeJours: 2, coutFormateurJour: 360, coutSupportParticipant: 14, coutSalleJour: 40, capacite: 10 },
  { id: "afgsu1", code: "AFGSU 1",  nom: "Gestes & soins d'urgence niv.1", color: "#029393", dureeJours: 2, coutFormateurJour: 400, coutSupportParticipant: 20, coutSalleJour: 50, capacite: 12 },
  { id: "incendie", code: "INCENDIE", nom: "Sécurité incendie", color: "#ff838f", dureeJours: 1, coutFormateurJour: 300, coutSupportParticipant: 8, coutSalleJour: 30, capacite: 14 },
];
const formById = (id) => FORMATIONS.find((f) => f.id === id);
// Origines de lead — référentiel commercial unique (d'où vient la demande).
const ORIGINES_LEAD = [
  { id: "lonasante_ind",    label: "Lonasanté individuel", court: "Lona · indiv.",  canal: "LONASANTE",       segment: "Individuel", color: "#00b4bc" },
  { id: "lonasante_grp",    label: "Lonasanté groupe",     court: "Lona · groupe",  canal: "LONASANTE",       segment: "Groupe",     color: "#029393" },
  { id: "adwords_ind",      label: "Adwords individuel",   court: "Ads · indiv.",   canal: "ADWORDS",         segment: "Individuel", color: "#ef7507" },
  { id: "adwords_grp",      label: "Adwords groupe",       court: "Ads · groupe",   canal: "ADWORDS",         segment: "Groupe",     color: "#b5760a" },
  { id: "partenaire",       label: "Partenaire",           court: "Partenaire",     canal: "PARTENAIRE",      color: "#7a5cf0" },
  { id: "laboform",         label: "Laboform",             court: "Laboform",       canal: "LABOFORM",        color: "#e02436" },
  { id: "client_recurrent", label: "Client récurent",      court: "Récurrent",      canal: "CLIENT RECURENT", color: "#ff838f", precision: "Lequel ?" },
];
const SANS_ORIGINE = "#98a2b3";

// Paliers de relance : l'alerte se déclenche à J+3, J+9, J+15 puis J+30 après la
// dernière relance, uniquement pour les prospects « Nouveau » ou « Devis en cours ».
const PALIERS_RELANCE = [
  { j: 3,  label: "J+3",  ton: "À relancer",   color: "#0e9aa7" },
  { j: 9,  label: "J+9",  ton: "Relance ferme", color: "#ef7507" },
  { j: 15, label: "J+15", ton: "Urgent",       color: "#e02436" },
  { j: 30, label: "J+30", ton: "Critique",     color: "#8b1220" },
];
const STAGES_RELANCABLES = ["nouveau", "devis"];
// Tarifs de référence par participant, pour pré-remplir un montant estimé (identiques au serveur).
const TARIF_INDICATIF = { afgsu2: 480, afgsu1: 300, mac: 180, macsst: 90, sstin: 180, incendie: 90 };
// Déduit la formation d'une demande à partir de son libellé.
const devinerFormation = (lead) => {
  const t = `${(lead && lead.formationShort) || ""} ${(lead && lead.formation) || ""}`;
  if (/afgsu\s*2|gsu\s*2|niveau\s*2/i.test(t)) return "afgsu2";
  if (/afgsu\s*1|gsu\s*1|niveau\s*1/i.test(t)) return "afgsu1";
  if (/mac\s*sst/i.test(t)) return "macsst";
  if (/\bmac\b|maintien|actualisation|recyclage/i.test(t)) return "mac";
  if (/sst/i.test(t)) return "sstin";
  if (/incendie|ssiap|extincteur/i.test(t)) return "incendie";
  return "afgsu2";
};
const origineById = (id) => ORIGINES_LEAD.find((o) => o.id === id) || null;
const origineLabel = (p) => {
  const o = origineById(p && p.origineId);
  if (!o) return (p && p.source) || "Origine à préciser";
  return o.precision && p.origineDetail ? `${o.label} — ${p.origineDetail}` : o.label;
};
const origineCourt = (p) => {
  const o = origineById(p && p.origineId);
  if (!o) return (p && p.source) || "À préciser";
  return o.precision && p.origineDetail ? `${o.court} · ${p.origineDetail}` : o.court;
};
const origineCouleur = (p) => (origineById(p && p.origineId) || {}).color || SANS_ORIGINE;
// Reprise des anciens prospects : déduit l'origine quand la source textuelle est sans ambiguïté.
// LONASANTE et ADWORDS restent à préciser (individuel ou groupe indéterminé).
const deduireOrigine = (source) => {
  const t = (source || "").toLowerCase();
  if (t.includes("laboform")) return "laboform";
  if (t.includes("récur") || t.includes("recur")) return "client_recurrent";
  if (t.includes("partenaire")) return "partenaire";
  return null;
};
const migrerProspects = (liste) => (liste || []).map((p) => (
  p && p.origineId !== undefined ? p : { ...p, origineId: deduireOrigine(p && p.source), origineDetail: "" }
));

const SOURCES = ["LONASANTE", "INTER CDF", "LABOFORM", "Client récurent", "Partenaire", "ADWORDS", "Dentall Project", "Site web", "Salon", "Recommandation"];
// Causes de refus / non-pertinence (liste déroulante CRM)
const MOTIFS_REFUS = [
  "Budget trop élevé",
  "Absence de financement / OPCO",
  "Choix d'un concurrent",
  "Projet reporté",
  "Projet annulé",
  "Délais incompatibles",
  "Besoin non confirmé",
  "Sans réponse / injoignable",
  "Hors périmètre (agrément / zone)",
  "Demande individuelle (hors intra)",
  "Doublon / erreur de saisie",
  "Autre",
];
const FORMATEURS = ["Serrurier", "Petit", "Callais", "Valarcher", "Leguilloux", "Kanté", "Llorca", "May", "Jeanselme", "Brion"];
const MOIS = ["avr.-26","mai-26","juin-26","juil.-26","août-26","sept.-26","oct.-26","nov.-26","déc.-26","janv.-27","févr.-27","mars-27"];
const moisOrder = (m) => MOIS.indexOf(m);

const FACT_STATUTS = {
  paye:    { label: "Payé",       color: "var(--st-won)",  bg: "var(--st-won-bg)" },
  attente: { label: "En attente", color: "var(--st-new)",  bg: "var(--st-new-bg)" },
  retard:  { label: "Retard",     color: "var(--st-lost)", bg: "var(--st-lost-bg)" },
  so:      { label: "Sans objet", color: "var(--ink-3)",   bg: "var(--surface-3)" },
};

// Paramètres de pilotage — objectifs, charges fixes + marketing mensuels, capacité par défaut
// Date du jour, calculée au chargement de l'application (ancrée à midi pour
// neutraliser les effets de fuseau horaire). Elle détermine l'état des sessions
// (réalisée / à venir), l'ancienneté des factures et les paliers de relance.
const dateDuJour = () => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; };
const TODAY_REF = dateDuJour();
const DEFAULT_PARAMS = { objectif: 27000, objectifAnnuel: 460000, charges: 12780, marketing: 3417, capacite: 12, canalSpend: {}, n1CA: {} };
const nval = (v) => { const x = parseFloat(v); return Number.isNaN(x) ? 0 : x; };
// CA de l'exercice précédent (N-1) par mois, repris du suivi source — pour le comparatif et la saisonnalité
// Exercice précédent (N-1, 2025-2026) — données réelles importées de DATA_GSU_2025_Synthese.xlsx
const N1_DATA = {
  exercice: "2025-2026",
  months: [
    { mois: "avr.-26", ca: 25520, marge: 11682, sessions: 8, cand: 82 },
    { mois: "mai-26", ca: 26580, marge: 13690, sessions: 7, cand: 69 },
    { mois: "juin-26", ca: 47574, marge: 17582, sessions: 15, cand: 144 },
    { mois: "juil.-26", ca: 12140, marge: 5511, sessions: 4, cand: 42 },
    { mois: "août-26", ca: 14585, marge: 7288, sessions: 3, cand: 34 },
    { mois: "sept.-26", ca: 32755, marge: 14788, sessions: 10, cand: 93 },
    { mois: "oct.-26", ca: 52995, marge: 17066, sessions: 14, cand: 129 },
    { mois: "nov.-26", ca: 46360, marge: 27443, sessions: 17, cand: 162 },
    { mois: "déc.-26", ca: 20465, marge: 12349, sessions: 7, cand: 60 },
    { mois: "janv.-27", ca: 32025, marge: 10784, sessions: 12, cand: 102 },
    { mois: "févr.-27", ca: 31265, marge: 14540, sessions: 10, cand: 92 },
    { mois: "mars-27", ca: 38184, marge: 17501, sessions: 12, cand: 112 },
  ],
  parFormation: {
    afgsu2: { ca: 269313, marge: 118357, sessions: 63, cand: 611 },
    mac: { ca: 83375, marge: 37457, sessions: 46, cand: 415 },
    afgsu1: { ca: 27760, marge: 14409, sessions: 10, cand: 95 },
  },
  parCanal: {
    "LABOFORM": { ca: 105775, sessions: 29, cand: 279 },
    "INTER CDF": { ca: 90360, sessions: 29, cand: 242 },
    "LONASANTE": { ca: 62265, sessions: 21, cand: 209 },
    "CLIENT RECURENT": { ca: 59514, sessions: 17, cand: 177 },
    "ADWORDS": { ca: 30074, sessions: 10, cand: 99 },
    "DENTALL PROJECT": { ca: 26880, sessions: 11, cand: 101 },
    "PARTENAIRE": { ca: 5580, sessions: 2, cand: 14 },
  },
  total: { ca: 380448, marge: 170223, sessions: 119, cand: 1121 },
};
const CA_N1 = Object.fromEntries(N1_DATA.months.map((m) => [m.mois, m.ca]));
const N1_TOTAL = N1_DATA.total.ca;
// CA N-1 d'un mois, avec correction manuelle éventuelle (params.n1CA)
const n1Ca = (label, params) => {
  const ov = params && params.n1CA ? params.n1CA[label] : undefined;
  return ov != null && ov !== "" ? Number(ov) : (CA_N1[label] || 0);
};
// Objectif mensuel saisonnalisé : l'objectif annuel réparti selon la saisonnalité N-1
const objectifMois = (label, params) => {
  const annuel = params.objectifAnnuel || 0;
  if (!annuel || !N1_TOTAL || !(label in CA_N1)) return params.objectif || 0;
  return Math.round(annuel * (CA_N1[label] / N1_TOTAL));
};
// Moteur de calcul d'une session : CA HT (forfait groupe OU prix par candidat × candidats),
// coûts directs (repas + formateur + CESU + locaux + partenaire), marge brute, taux, remplissage, état, heures.
const computeSession = (s, params = DEFAULT_PARAMS) => {
  const caht = s.base === "Par candidat" ? nval(s.nbCand) * nval(s.prixCand) : nval(s.forfait);
  const coutVar = nval(s.repas) + nval(s.cFormateur) + nval(s.cesu) + nval(s.locaux) + nval(s.partenaire);
  const mb = caht - coutVar;
  const tx = caht > 0 ? mb / caht : null;
  const tva = nval(s.tva) / 100;
  const ttc = caht * (1 + tva);
  // Aucune valeur n'est inventée : une donnée absente vaut null et s'affiche « — ».
  const capaciteSaisie = nval(s.placesMax) > 0;
  const heuresSaisies = nval(s.heures) > 0;
  const coutSaisi = coutVar > 0;
  const eff = capaciteSaisie ? nval(s.placesMax) : null;
  const presents = nval(s.presents) || nval(s.nbParticipants) || nval(s.nbCand) || 0;
  const rempl = capaciteSaisie && presents > 0 ? presents / eff : null;
  const heures = heuresSaisies ? nval(s.heures) : null;
  const margeAppr = presents > 0 && coutSaisi ? mb / presents : null;
  const margeHoraire = heuresSaisies && coutSaisi ? mb / heures : null;
  const partFormateur = caht > 0 ? (nval(s.cFormateur) + nval(s.cesu)) / caht : null;
  const passe = s.date ? (new Date(s.date) <= TODAY_REF) : false;
  let etat;
  if (s.annulee) etat = "Annulée";
  else if (caht <= 0) etat = "Planifiée";
  else if (passe) etat = "Réalisée";
  else etat = "À venir";
  return { caht, coutVar, mb, tx, tva, ttc, eff, rempl, heures, etat, passe,
    capaciteSaisie, heuresSaisies, coutSaisi, presents, margeAppr, margeHoraire, partFormateur };
};
// Styles d'état
const ETAT_STYLE = {
  "Réalisée":  { color: "var(--st-won)",  bg: "var(--st-won-bg)" },
  "À venir":   { color: "var(--st-new)",  bg: "var(--st-new-bg)" },
  "Planifiée": { color: "var(--gold)",    bg: "var(--gold-50)" },
  "Annulée":   { color: "var(--ink-3)",   bg: "var(--surface-3)" },
};

/* ============================================================= *
 *  DONNÉES DE DÉMONSTRATION
 * ============================================================= */
let _id = 100;
const uid = (p = "id") => `${p}_${++_id}`;
const bumpUid = (n) => { if (Number.isFinite(n) && n > _id) _id = n; };
const STORE_KEY = "extralife:state";
const LEGACY_STORE_KEY = "vitalis:state";

// Sessions réelles de l'exercice 2026-2027 (importées du suivi de rentabilité)
const _ab = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
const _moisLbl = (iso) => { const d = new Date(iso); return `${_ab[d.getMonth()]}-${String(d.getFullYear()).slice(2)}`; };
const SESSIONS_RAW = [{"date":"2026-04-04","annulee":false,"formationId":"mac","origine":"PARTENAIRE","client":"VILLEFRANCHE AMBU","formateur":"SERRURIER","nbCand":5,"base":"Groupe","prixCand":null,"forfait":1260,"repas":0,"cFormateur":412,"cesu":100,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-07","annulee":false,"formationId":"macsst","origine":"CLIENT RECURENT","client":"LOU PRAT DOU SOLELH","formateur":"PETIT","nbCand":8,"base":"Groupe","prixCand":null,"forfait":720,"repas":0,"cFormateur":300,"cesu":0,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-09","annulee":false,"formationId":"incendie","origine":"ADWORDS","client":"SWEN","formateur":"CLOUX","nbCand":5,"base":"Groupe","prixCand":null,"forfait":540,"repas":0,"cFormateur":250,"cesu":0,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-09","annulee":false,"formationId":"afgsu2","origine":"CLIENT RECURENT","client":"ADESDA POISSY","formateur":"KANTE","nbCand":11,"base":"Groupe","prixCand":null,"forfait":3888,"repas":0,"cFormateur":1437.54,"cesu":220,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-09","annulee":false,"formationId":"afgsu2","origine":"CLIENT RECURENT","client":"ADESDA TRAPPES","formateur":"VALARCHER","nbCand":10,"base":"Groupe","prixCand":null,"forfait":3888,"repas":0,"cFormateur":1700,"cesu":240,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-09","annulee":false,"formationId":"sstin","origine":"CLIENT RECURENT","client":"LYSANDER","formateur":"PETIT","nbCand":8,"base":"Groupe","prixCand":null,"forfait":1400,"repas":0,"cFormateur":600,"cesu":0,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-10","annulee":false,"formationId":"afgsu2","origine":"LONASANTE","client":"MSP GODERVILLE","formateur":"CALLAIS","nbCand":11,"base":"Groupe","prixCand":null,"forfait":3600,"repas":0,"cFormateur":2171.25,"cesu":200,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-10","annulee":false,"formationId":"afgsu2","origine":"PARTENAIRE","client":"ORDRE DES IDE VANNES","formateur":"LEGUILLOUX","nbCand":10,"base":"Par candidat","prixCand":480,"forfait":null,"repas":0,"cFormateur":1700,"cesu":200,"locaux":658,"partenaire":720,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-22","annulee":false,"formationId":"afgsu2","origine":"INTER CDF","client":"CDF","formateur":"CALLAIS","nbCand":11,"base":"Par candidat","prixCand":480,"forfait":null,"repas":838.2,"cFormateur":1200,"cesu":220,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-22","annulee":false,"formationId":"afgsu2","origine":"CLIENT RECURENT","client":"EHPAD MEXIMIEUX","formateur":"SERRURIER","nbCand":7,"base":"Groupe","prixCand":null,"forfait":4320,"repas":0,"cFormateur":1560,"cesu":140,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-23","annulee":false,"formationId":"macsst","origine":"CLIENT RECURENT","client":"HAFNER","formateur":"LLORCA","nbCand":9,"base":"Groupe","prixCand":null,"forfait":880,"repas":0,"cFormateur":330,"cesu":0,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-27","annulee":false,"formationId":"mac","origine":"INTER CDF","client":"CDF","formateur":"CALLAIS","nbCand":10,"base":"Par candidat","prixCand":180,"forfait":null,"repas":269.5,"cFormateur":400,"cesu":210,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-04-30","annulee":false,"formationId":"sstin","origine":"ADWORDS","client":"SWEN","formateur":"THERIN","nbCand":5,"base":"Groupe","prixCand":null,"forfait":1130.5,"repas":0,"cFormateur":600,"cesu":0,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-05-06","annulee":false,"formationId":"afgsu2","origine":"LONASANTE","client":"BIOPATH PARIS","formateur":"VALARCHER","nbCand":8,"base":"Groupe","prixCand":null,"forfait":3900,"repas":0,"cFormateur":1700,"cesu":160,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-05-06","annulee":false,"formationId":"macsst","origine":"CLIENT RECURENT","client":"SAFRAN","formateur":"GALONNE","nbCand":9,"base":"Groupe","prixCand":null,"forfait":850,"repas":0,"cFormateur":350,"cesu":0,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-05-12","annulee":false,"formationId":"afgsu2","origine":"ADWORDS","client":"EHPAD HEYRIEUX","formateur":"SERRURIER","nbCand":11,"base":"Groupe","prixCand":null,"forfait":3900,"repas":0,"cFormateur":1980,"cesu":220,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-05-21","annulee":false,"formationId":"mac","origine":"INTER CDF","client":"CDF LYON","formateur":"CALLAIS","nbCand":11,"base":"Par candidat","prixCand":180,"forfait":null,"repas":289.5,"cFormateur":400,"cesu":200,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-05-26","annulee":false,"formationId":"mac","origine":"DENTALL PROJECT","client":"LA TOUR DU PIN","formateur":"JEANSELME","nbCand":10,"base":"Par candidat","prixCand":180,"forfait":null,"repas":0,"cFormateur":400,"cesu":200,"locaux":0,"partenaire":180,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-05-27","annulee":false,"formationId":"macsst","origine":"CLIENT RECURENT","client":"LYSANDER","formateur":"PETIT","nbCand":10,"base":"Groupe","prixCand":null,"forfait":700,"repas":0,"cFormateur":300,"cesu":0,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-05-27","annulee":false,"formationId":"afgsu1","origine":"LONASANTE","client":"CDEF 44","formateur":"LEGUILLOUX","nbCand":7,"base":"Groupe","prixCand":null,"forfait":3250,"repas":0,"cFormateur":1400,"cesu":140,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-05-29","annulee":false,"formationId":"mac","origine":"LONASANTE","client":"LES LAURIERS (59)","formateur":"CARPENTIER","nbCand":6,"base":"Groupe","prixCand":null,"forfait":1350,"repas":0,"cFormateur":550,"cesu":120,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-01","annulee":false,"formationId":"mac","origine":"LABOFORM","client":"HDO","formateur":"PERROTEL","nbCand":6,"base":"Par candidat","prixCand":205,"forfait":null,"repas":215.27,"cFormateur":551.03,"cesu":120,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-03","annulee":false,"formationId":"afgsu2","origine":"LABOFORM","client":"HDO","formateur":"PERROTEL","nbCand":5,"base":"Par candidat","prixCand":550,"forfait":null,"repas":426.2,"cFormateur":1653,"cesu":100,"locaux":null,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-03","annulee":false,"formationId":"macsst","origine":"CLIENT RECURENT","client":"LYSANDER","formateur":"PETIT","nbCand":7,"base":"Groupe","prixCand":null,"forfait":700,"repas":0,"cFormateur":300,"cesu":0,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-04","annulee":false,"formationId":"mac","origine":"INTER CDF","client":"TOULOUSE","formateur":"MICHELON","nbCand":11,"base":"Par candidat","prixCand":180,"forfait":null,"repas":0,"cFormateur":570,"cesu":220,"locaux":408,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-08","annulee":false,"formationId":"mac","origine":"LABOFORM","client":"BSD","formateur":"LEGUILLOUX","nbCand":12,"base":"Par candidat","prixCand":205,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-12","annulee":false,"formationId":"afgsu2","origine":"LABOFORM","client":"BSD","formateur":"LEGUILLOUX","nbCand":11,"base":"Par candidat","prixCand":550,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-12","annulee":false,"formationId":"afgsu2","origine":"LABOFORM","client":"LONS","formateur":"BRION","nbCand":11,"base":"Par candidat","prixCand":550,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-15","annulee":false,"formationId":"mac","origine":"LABOFORM","client":"LINGOLSHEIM","formateur":"THOMAS","nbCand":12,"base":"Par candidat","prixCand":205,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-15","annulee":false,"formationId":"macsst","origine":"CLIENT RECURENT","client":"HAFNER","formateur":"LLORCA","nbCand":7,"base":"Groupe","prixCand":null,"forfait":880,"repas":0,"cFormateur":300,"cesu":0,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-17","annulee":false,"formationId":"afgsu2","origine":"INTER CDF","client":"CDF","formateur":"CALLAIS","nbCand":12,"base":"Par candidat","prixCand":480,"forfait":null,"repas":780,"cFormateur":1200,"cesu":240,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-17","annulee":false,"formationId":"afgsu2","origine":"LONASANTE","client":"APSSAD","formateur":"VALARCHER","nbCand":11,"base":"Groupe","prixCand":null,"forfait":3490,"repas":0,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-18","annulee":false,"formationId":"mac","origine":"INTER CDF","client":"Francheville","formateur":"CALLAIS","nbCand":10,"base":"Par candidat","prixCand":180,"forfait":null,"repas":220,"cFormateur":400,"cesu":200,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-18","annulee":false,"formationId":"afgsu2","origine":"CLIENT RECURENT","client":"BIOPATH","formateur":"SERRURIER","nbCand":7,"base":"Groupe","prixCand":null,"forfait":3900,"repas":0,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-18","annulee":false,"formationId":"afgsu2","origine":"LABOFORM","client":"MERIGNAC","formateur":"TRANCHANT","nbCand":8,"base":"Par candidat","prixCand":550,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-19","annulee":false,"formationId":"afgsu1","origine":"PARTENAIRE","client":"ISPE2A","formateur":"GRANDNOM","nbCand":10,"base":"Groupe","prixCand":null,"forfait":3000,"repas":0,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-19","annulee":false,"formationId":"mac","origine":"DENTALL PROJECT","client":"Dr PETCHY","formateur":"MAY","nbCand":6,"base":"Par candidat","prixCand":180,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-22","annulee":false,"formationId":"mac","origine":"LABOFORM","client":"CIME DENTAIRE","formateur":"JEANSELME","nbCand":12,"base":"Par candidat","prixCand":205,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-22","annulee":false,"formationId":"mac","origine":"LABOFORM","client":"IGR","formateur":"VALARCHER","nbCand":null,"base":"Groupe","prixCand":null,"forfait":1350,"repas":0,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-23","annulee":false,"formationId":"incendie","origine":"DENTALL PROJECT","client":"INCENDIE DENTAL GLOS","formateur":"PADOVANI","nbCand":null,"base":"Groupe","prixCand":null,"forfait":450,"repas":0,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-24","annulee":false,"formationId":"afgsu2","origine":"ADWORDS","client":"CPTS Lyon Prsqu'île","formateur":"MAY","nbCand":11,"base":"Groupe","prixCand":null,"forfait":3950,"repas":0,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-24","annulee":false,"formationId":"sstin","origine":"ADWORDS","client":"F2I","formateur":"MENDES","nbCand":null,"base":"Groupe","prixCand":null,"forfait":1100,"repas":0,"cFormateur":500,"cesu":0,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-25","annulee":false,"formationId":"afgsu2","origine":"LABOFORM","client":"CIME DENTAIRE","formateur":"JEANSELME","nbCand":null,"base":"Par candidat","prixCand":550,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-22","annulee":false,"formationId":null,"origine":"","client":"EDI","formateur":"KANTE","nbCand":6,"base":"Par candidat","prixCand":205,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-25","annulee":false,"formationId":"afgsu2","origine":"LABOFORM","client":"EDI","formateur":"KANTE","nbCand":10,"base":"Par candidat","prixCand":550,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-29","annulee":false,"formationId":"mac","origine":"LONASANTE","client":"IGR","formateur":"VALARCHER","nbCand":null,"base":"Groupe","prixCand":null,"forfait":1350,"repas":0,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-29","annulee":false,"formationId":"mac","origine":"CLIENT RECURENT","client":"BIOPATH","formateur":"KANTE","nbCand":null,"base":"Groupe","prixCand":null,"forfait":1500,"repas":0,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-29","annulee":false,"formationId":"mac","origine":"ADWORDS","client":"CPTS Presqu'île Lyon","formateur":"MAY","nbCand":null,"base":"Groupe","prixCand":null,"forfait":1500,"repas":0,"cFormateur":null,"cesu":null,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-07-02","annulee":false,"formationId":"afgsu2","origine":"PARTENAIRE","client":"FORMATOP","formateur":"CHILLET","nbCand":null,"base":"Groupe","prixCand":null,"forfait":3000,"repas":0,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-07-03","annulee":false,"formationId":"afgsu2","origine":"LONASANTE","client":"Les Perles Grises","formateur":"BUISAN","nbCand":15,"base":"Groupe","prixCand":null,"forfait":4940,"repas":0,"cFormateur":3509,"cesu":300,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-07-03","annulee":false,"formationId":"afgsu2","origine":"INTER CDF","client":"CDF","formateur":"CALLAIS","nbCand":12,"base":"Par candidat","prixCand":480,"forfait":null,"repas":780,"cFormateur":1200,"cesu":240,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-07-06","annulee":false,"formationId":"mac","origine":"INTER CDF","client":"CDF","formateur":"CALLAIS","nbCand":6,"base":"Par candidat","prixCand":180,"forfait":null,"repas":140,"cFormateur":400,"cesu":120,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-07-09","annulee":false,"formationId":"afgsu2","origine":"INTER CDF","client":"CDF","formateur":"","nbCand":5,"base":"Par candidat","prixCand":489.6,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-07-10","annulee":false,"formationId":"afgsu2","origine":"PARTENAIRE","client":"IDEA Montpelier","formateur":"MARCHAL","nbCand":null,"base":"Groupe","prixCand":null,"forfait":3500,"repas":0,"cFormateur":1938.5,"cesu":240,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-07-15","annulee":false,"formationId":"afgsu2","origine":"LONASANTE","client":"Les balcons du Dauphiné","formateur":"JEANSELME","nbCand":null,"base":"Groupe","prixCand":null,"forfait":3030,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-08-05","annulee":false,"formationId":"afgsu2","origine":"INTER CDF","client":"CDF Francheville","formateur":"CALLAIS","nbCand":6,"base":"Par candidat","prixCand":480,"forfait":null,"repas":null,"cFormateur":1200,"cesu":null,"locaux":0,"partenaire":0,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-08-06","annulee":false,"formationId":"mac","origine":"INTER CDF","client":"CDF Francheville","formateur":"CALLAIS","nbCand":0,"base":"Par candidat","prixCand":180,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-08-26","annulee":false,"formationId":"afgsu2","origine":"PARTENAIRE","client":"FORMATOP","formateur":"SERRURIER","nbCand":null,"base":"Groupe","prixCand":null,"forfait":3000,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-08-26","annulee":false,"formationId":"afgsu2","origine":"LONASANTE","client":"CNFPT 83","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":3420,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-08-26","annulee":false,"formationId":"afgsu2","origine":"LONASANTE","client":"CNFPT 83","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":3420,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-08-26","annulee":false,"formationId":"afgsu2","origine":"LONASANTE","client":"CNFPT 83","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":3420,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-04","annulee":false,"formationId":"afgsu2","origine":"CLIENT RECURENT","client":"CDEF 44","formateur":"LEGUILLOUX","nbCand":null,"base":"Groupe","prixCand":null,"forfait":4200,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-03","annulee":false,"formationId":"mac","origine":"ADWORDS","client":"Metz","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":1500,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-03","annulee":false,"formationId":"mac","origine":"ADWORDS","client":"Metz","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":1500,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-09","annulee":false,"formationId":"afgsu2","origine":"INTER CDF","client":"CDF","formateur":"CALLAIS","nbCand":12,"base":"Par candidat","prixCand":480,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-09","annulee":false,"formationId":"afgsu2","origine":"INTER CDF","client":"Nantes","formateur":"","nbCand":null,"base":"Par candidat","prixCand":480,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-10","annulee":false,"formationId":"afgsu2","origine":"PARTENAIRE","client":"FORMATOP","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":3000,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-10","annulee":false,"formationId":"mac","origine":"INTER CDF","client":"CDF","formateur":"","nbCand":null,"base":"Par candidat","prixCand":180,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-16","annulee":false,"formationId":"afgsu2","origine":"INTER CDF","client":"Boulogne-Billancourt","formateur":"","nbCand":null,"base":"Par candidat","prixCand":480,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-16","annulee":false,"formationId":"afgsu2","origine":"PARTENAIRE","client":"IDEA Marseille","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":3500,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-16","annulee":false,"formationId":"afgsu2","origine":"DENTALL PROJECT","client":"Paris","formateur":"","nbCand":null,"base":"Par candidat","prixCand":480,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-16","annulee":false,"formationId":"afgsu2","origine":"CLIENT RECURENT","client":"BIOPATH PARIS","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":3900,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-15","annulee":false,"formationId":"mac","origine":"LONASANTE","client":"Vivre et devenir","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":1500,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-15","annulee":false,"formationId":"sstin","origine":"INTER CDF","client":"CDF","formateur":"","nbCand":null,"base":"Par candidat","prixCand":180,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-15","annulee":false,"formationId":null,"origine":"CLIENT RECURENT","client":"CDEF 44","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":400,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-17","annulee":false,"formationId":"mac","origine":"INTER CDF","client":"Boulogne-Billancourt","formateur":"","nbCand":null,"base":"Par candidat","prixCand":180,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-17","annulee":false,"formationId":"mac","origine":"INTER CDF","client":"Marseille","formateur":"","nbCand":null,"base":"Par candidat","prixCand":180,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-17","annulee":false,"formationId":"mac","origine":"INTER CDF","client":"Francheville","formateur":"","nbCand":null,"base":"Par candidat","prixCand":180,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-23","annulee":false,"formationId":"afgsu2","origine":"PARTENAIRE","client":"FORMATOP","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":3000,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-21","annulee":false,"formationId":"mac","origine":"DENTALL PROJECT","client":"Dentall Project","formateur":"","nbCand":null,"base":"Par candidat","prixCand":180,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-21","annulee":false,"formationId":"mac","origine":"LABOFORM","client":"Lingolsheim","formateur":"","nbCand":null,"base":"Par candidat","prixCand":205,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-21","annulee":false,"formationId":"mac","origine":"DENTALL PROJECT","client":"Paris","formateur":"","nbCand":null,"base":"Par candidat","prixCand":180,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-21","annulee":false,"formationId":"incendie","origine":"DENTALL PROJECT","client":"Meximieux","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":450,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-24","annulee":false,"formationId":"afgsu2","origine":"INTER CDF","client":"Rennes","formateur":"","nbCand":null,"base":"Par candidat","prixCand":480,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-24","annulee":false,"formationId":"afgsu2","origine":"LABOFORM","client":"Lingolsheim","formateur":"","nbCand":null,"base":"Par candidat","prixCand":550,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-24","annulee":false,"formationId":"afgsu2","origine":"DENTALL PROJECT","client":"Rillieux","formateur":"","nbCand":null,"base":"Par candidat","prixCand":480,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-06-29","annulee":false,"formationId":"afgsu1","origine":"LONASANTE","client":"DITEP La Cordée","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":2300,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-30","annulee":false,"formationId":"afgsu2","origine":"INTER CDF","client":"Francheville","formateur":"","nbCand":null,"base":"Par candidat","prixCand":480,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-09-30","annulee":false,"formationId":"afgsu2","origine":"INTER CDF","client":"Montpellier","formateur":"","nbCand":null,"base":"Par candidat","prixCand":480,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"afgsu1","origine":"CLIENT RECURENT","client":"IGR","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":2100,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"afgsu2","origine":"DENTALL PROJECT","client":"Sathonay Camp","formateur":"","nbCand":null,"base":"Par candidat","prixCand":480,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"mac","origine":"LONASANTE","client":"ADAPEI 77","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":1500,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"mac","origine":"LONASANTE","client":"Lyon 6","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":1200,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"mac","origine":"LABOFORM","client":"BSD","formateur":"","nbCand":null,"base":"Par candidat","prixCand":205,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"mac","origine":"LABOFORM","client":"FDC","formateur":"","nbCand":null,"base":"Par candidat","prixCand":205,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"mac","origine":"LABOFORM","client":"CONCEPT DENTAIRE","formateur":"","nbCand":null,"base":"Par candidat","prixCand":205,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"mac","origine":"LABOFORM","client":"OMNIUM","formateur":"","nbCand":null,"base":"Par candidat","prixCand":205,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"afgsu2","origine":"DENTALL PROJECT","client":"Paris","formateur":"","nbCand":null,"base":"Par candidat","prixCand":480,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"afgsu2","origine":"LABOFORM","client":"FDC","formateur":"","nbCand":null,"base":"Par candidat","prixCand":550,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"afgsu2","origine":"LABOFORM","client":"BSD","formateur":"","nbCand":null,"base":"Par candidat","prixCand":550,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"afgsu2","origine":"LABOFORM","client":"OMNIUM","formateur":"","nbCand":null,"base":"Par candidat","prixCand":550,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"afgsu2","origine":"LABOFORM","client":"CONCEPT DENTAIRE","formateur":"","nbCand":null,"base":"Par candidat","prixCand":550,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null},{"date":"2026-10-01","annulee":false,"formationId":"afgsu2","origine":"","client":"","formateur":"","nbCand":null,"base":"Groupe","prixCand":null,"forfait":null,"repas":null,"cFormateur":null,"cesu":null,"locaux":null,"partenaire":null,"tva":0,"statut":"paye","placesMax":null}];
const _FINANCEMENT_PAR_ORIGINE = { "LABOFORM":"OPCO", "LONASANTE":"OPCO", "INTER CDF":"Entreprise", "PARTENAIRE":"Entreprise", "DENTALL PROJECT":"Entreprise", "CLIENT RECURENT":"Entreprise", "ADWORDS":"Entreprise" };
const SEED_FACTURES = SESSIONS_RAW.map((r, i) => {
  const c = computeSession(r);
  return {
    id: uid("s"), ref: `S-${String(i + 1).padStart(3, "0")}`,
    ...r, mois: _moisLbl(r.date), source: r.origine || "",
    montantHT: c.caht, coutVar: c.coutVar, nbParticipants: r.nbCand == null ? 0 : r.nbCand,
    // suivi pédagogique / Qualiopi (à compléter par l'utilisateur ; valeurs neutres par défaut)
    heures: null,
    presents: c.passe && r.nbCand != null ? r.nbCand : null,
    satisfaction: null,
    evalFaite: false,
    attestations: null,
    financement: _FINANCEMENT_PAR_ORIGINE[r.origine] || "Entreprise",
  };
});

// Dépenses (charges fixes + marketing) — calées sur ~12 580 €/mois de structure
const moisDates = { "avr.-26":"2026-04-30","mai-26":"2026-05-31","juin-26":"2026-06-30","juil.-26":"2026-07-31","août-26":"2026-08-31","sept.-26":"2026-09-30","oct.-26":"2026-10-31" };
const SEED_DEPENSES = [];
["avr.-26","mai-26","juin-26","juil.-26","août-26","sept.-26","oct.-26"].forEach((mois) => {
  const d = moisDates[mois];
  SEED_DEPENSES.push(
    { id: uid("d"), mois, date: d, categorie: "Salaires", libelle: "Salaires & charges sociales", montant: 6800, recurrent: true },
    { id: uid("d"), mois, date: d, categorie: "Loyer",    libelle: "Loyer & charges locatives",     montant: 1850, recurrent: true },
    { id: uid("d"), mois, date: d, categorie: "Logiciels",libelle: "Logiciels / SaaS",              montant: 540,  recurrent: true },
    { id: uid("d"), mois, date: d, categorie: "Honoraires",libelle:"Honoraires comptables",         montant: 480,  recurrent: true },
    { id: uid("d"), mois, date: d, categorie: "Assurances",libelle:"Assurances pro",                montant: 420,  recurrent: true },
    { id: uid("d"), mois, date: d, categorie: "Télécom",   libelle:"Télécom / Internet",            montant: 290,  recurrent: true },
    { id: uid("d"), mois, date: d, categorie: "Marketing", libelle:"Google Ads",  canal:"ADWORDS",  montant: 500,  recurrent: true },
    { id: uid("d"), mois, date: d, categorie: "Marketing", libelle:"Apporteur LONASANTE", canal:"LONASANTE", montant: 580, recurrent: true },
    { id: uid("d"), mois, date: d, categorie: "Autres",    libelle:"Frais de déplacement formateurs", montant: 700, recurrent: false },
  );
});

// Prospects (pipeline CRM)
const today = dateDuJour();
const dStr = (offsetDays) => { const x = new Date(today); x.setDate(x.getDate() + offsetDays); return x.toISOString().slice(0,10); };
const SEED_PROSPECTS = [
  { id: uid("p"), contact:"Dr. Hélène Marchand", entreprise:"Clinique du Parc", email:"h.marchand@cliniqueduparc.fr", tel:"04 78 12 34 56",
    formationId:"afgsu2", montant:5400, proba:30, source:"ADWORDS", motifPerte:"",
    dateCreation:dStr(-4), derniereRelance:dStr(-1), dateSignaturePrevue:dStr(20), stage:"nouveau",
    notes:[{date:dStr(-4),txt:"Demande via Google Ads, 12 IDE à former sur l'AFGSU 2. Échéance fin juillet."}] },
  { id: uid("p"), contact:"Marc Lefèvre", entreprise:"EHPAD Les Tilleuls", email:"direction@lestilleuls.fr", tel:"01 45 88 22 10",
    formationId:"afgsu2", montant:3888, proba:25, source:"LONASANTE", motifPerte:"",
    dateCreation:dStr(-9), derniereRelance:dStr(-7), dateSignaturePrevue:dStr(25), stage:"nouveau",
    notes:[{date:dStr(-9),txt:"Reçu via apporteur LONASANTE. Budget à valider en conseil d'administration."}] },
  { id: uid("p"), contact:"Sophie Bernard", entreprise:"Cabinet dentaire Belle Rive", email:"contact@belleriv-dentaire.fr", tel:"05 56 77 88 99",
    formationId:"mac", montant:2460, proba:55, source:"LABOFORM", motifPerte:"",
    dateCreation:dStr(-12), derniereRelance:dStr(-3), dateSignaturePrevue:dStr(12), stage:"devis",
    notes:[{date:dStr(-12),txt:"Devis MAC pour 12 personnes envoyé."},{date:dStr(-3),txt:"Relance téléphonique, attend retour de la gérante."}] },
  { id: uid("p"), contact:"Julien Roy", entreprise:"CPTS Lyon Presqu'île", email:"coordination@cpts-lyon.fr", tel:"04 72 00 11 22",
    formationId:"afgsu2", montant:3950, proba:60, source:"ADWORDS", motifPerte:"",
    dateCreation:dStr(-15), derniereRelance:dStr(-2), dateSignaturePrevue:dStr(9), stage:"devis",
    notes:[{date:dStr(-15),txt:"Session AFGSU 2 pour 11 soignants. Devis transmis."},{date:dStr(-2),txt:"Ajustement des dates demandé."}] },
  { id: uid("p"), contact:"Nadia Cherif", entreprise:"Biopath Laboratoire", email:"n.cherif@biopath.fr", tel:"01 60 44 55 66",
    formationId:"afgsu2", montant:3900, proba:80, source:"Client récurent", motifPerte:"",
    dateCreation:dStr(-20), derniereRelance:dStr(-1), dateSignaturePrevue:dStr(6), stage:"signer",
    notes:[{date:dStr(-20),txt:"Client fidèle, renouvellement annuel AFGSU 2."},{date:dStr(-1),txt:"Bon de commande en cours de signature."}] },
  { id: uid("p"), contact:"Olivier Petit", entreprise:"Ordre des IDE Vannes", email:"secretariat@ordreide-vannes.fr", tel:"02 97 33 44 55",
    formationId:"afgsu2", montant:4800, proba:75, source:"Partenaire", motifPerte:"",
    dateCreation:dStr(-18), derniereRelance:dStr(-4), dateSignaturePrevue:dStr(11), stage:"signer",
    notes:[{date:dStr(-18),txt:"10 participants, facturation par candidat (480€)."}] },
  { id: uid("p"), contact:"Camille Dubois", entreprise:"Safran Site Évry", email:"c.dubois@safran.fr", tel:"01 40 60 80 00",
    formationId:"macsst", montant:850, proba:100, source:"Client récurent", motifPerte:"",
    dateCreation:dStr(-30), derniereRelance:dStr(-10), dateSignaturePrevue:dStr(-2), stage:"gagne",
    notes:[{date:dStr(-30),txt:"MAC SST 9 personnes."},{date:dStr(-2),txt:"Signé ! Session planifiée."}] },
  { id: uid("p"), contact:"Thomas Girard", entreprise:"Mérignac Logistique", email:"t.girard@merignac-log.fr", tel:"05 57 00 11 22",
    formationId:"afgsu2", montant:4400, proba:100, source:"LABOFORM", motifPerte:"",
    dateCreation:dStr(-28), derniereRelance:dStr(-9), dateSignaturePrevue:dStr(-5), stage:"gagne",
    notes:[{date:dStr(-28),txt:"8 candidats par AFGSU 2 (550€/candidat)."},{date:dStr(-5),txt:"Convention signée."}] },
  { id: uid("p"), contact:"Aurélie Moreau", entreprise:"Polyclinique Atlantique", email:"a.moreau@polyatlantique.fr", tel:"02 40 22 33 44",
    formationId:"afgsu2", montant:4200, proba:0, source:"Site web", motifPerte:"Budget non validé",
    dateCreation:dStr(-35), derniereRelance:dStr(-20), dateSignaturePrevue:"", stage:"perdu",
    notes:[{date:dStr(-35),txt:"Intéressée par AFGSU 2 sur 2 sessions."},{date:dStr(-20),txt:"Perdu : enveloppe formation gelée pour 2026."}] },
  { id: uid("p"), contact:"Pierre Lambert", entreprise:"Maison de santé Goderville", email:"p.lambert@msp-goderville.fr", tel:"02 35 11 22 33",
    formationId:"mac", montant:1800, proba:0, source:"Salon", motifPerte:"Choix d'un concurrent moins cher",
    dateCreation:dStr(-40), derniereRelance:dStr(-25), dateSignaturePrevue:"", stage:"perdu",
    notes:[{date:dStr(-40),txt:"Rencontré au salon Préventica."},{date:dStr(-25),txt:"Perdu au profit d'un organisme local."}] },
  { id: uid("p"), contact:"Léa Fontaine", entreprise:"IFSI Croix-Rouge", email:"l.fontaine@ifsi-cr.fr", tel:"03 20 55 66 77",
    formationId:"afgsu1", montant:3000, proba:40, source:"Recommandation", motifPerte:"",
    dateCreation:dStr(-6), derniereRelance:dStr(-6), dateSignaturePrevue:dStr(28), stage:"nouveau",
    notes:[{date:dStr(-6),txt:"Recommandé par CDEF 44. AFGSU 1 promotion étudiante."}] },
  { id: uid("p"), contact:"Karim Benali", entreprise:"Clinique Saint-Roch", email:"k.benali@clinique-stroch.fr", tel:"04 91 22 33 44",
    formationId:"afgsu2", montant:5760, proba:35, source:"ADWORDS", motifPerte:"",
    dateCreation:dStr(0), derniereRelance:dStr(0), dateSignaturePrevue:dStr(22), stage:"nouveau",
    notes:[{date:dStr(0),txt:"Demande entrante via Google Ads, 12 IDE à former."}] },
  { id: uid("p"), contact:"Émilie Tanguy", entreprise:"EHPAD La Roseraie", email:"direction@laroseraie.fr", tel:"02 99 11 22 33",
    formationId:"macsst", montant:880, proba:50, source:"LONASANTE", motifPerte:"",
    dateCreation:dStr(-1), derniereRelance:dStr(-1), dateSignaturePrevue:dStr(15), stage:"nouveau",
    notes:[{date:dStr(-1),txt:"Apporteur LONASANTE. MAC SST 8 personnes."}] },
  { id: uid("p"), contact:"Vincent Roussel", entreprise:"Groupe Vivalto", email:"v.roussel@vivalto.fr", tel:"02 23 44 55 66",
    formationId:"afgsu2", montant:4400, proba:45, source:"Partenaire", motifPerte:"",
    dateCreation:dStr(-3), derniereRelance:dStr(-3), dateSignaturePrevue:dStr(18), stage:"devis",
    notes:[{date:dStr(-3),txt:"Devis AFGSU 2 multi-sites en préparation."}] },
  { id: uid("p"), contact:"Service formation", entreprise:"Mairie de Bordeaux", email:"formation@bordeaux.fr", tel:"05 56 10 20 30",
    formationId:"incendie", montant:0, proba:0, source:"Site web", motifPerte:"Marché public — hors de notre périmètre d'agrément",
    dateCreation:dStr(-2), derniereRelance:dStr(-2), dateSignaturePrevue:"", stage:"npertinent",
    notes:[{date:dStr(-2),txt:"Appel d'offres public incendie ERP, agrément requis non détenu. Classé sans suite."}] },
  { id: uid("p"), contact:"Anonyme", entreprise:"Particulier (demande individuelle)", email:"contact@gmail.com", tel:"06 12 34 56 78",
    formationId:"sstin", montant:0, proba:0, source:"Site web", motifPerte:"Demande individuelle — nous formons uniquement des groupes en intra",
    dateCreation:dStr(-8), derniereRelance:dStr(-8), dateSignaturePrevue:"", stage:"npertinent",
    notes:[{date:dStr(-8),txt:"Particulier cherchant une place SST en inter. Hors offre."}] },
];

/* ============================================================= *
 *  HELPERS
 * ============================================================= */
const eur0 = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const eur2 = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtE = (n) => eur0.format(Math.round(n || 0));
const fmtE2 = (n) => eur2.format(n || 0);
const fmtPct = (n) => `${(n * 100).toFixed(n < 0.1 && n > 0 ? 1 : 0)} %`;
const fmtPct1 = (n) => `${(n * 100).toFixed(1)} %`;
const daysSince = (iso) => { if (!iso) return 9999; return Math.round((today - new Date(iso)) / 864e5); };
// Renvoie le palier de relance atteint, ou null si aucune alerte n'est due.
const palierRelance = (p) => {
  if (!p || !STAGES_RELANCABLES.includes(p.stage)) return null;
  const jours = daysSince(p.derniereRelance || p.dateCreation);
  let atteint = null;
  for (const pa of PALIERS_RELANCE) if (jours >= pa.j) atteint = pa;
  return atteint ? { ...atteint, jours } : null;
};
const frDate = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" }) : "—";

// --- Acquisition : regroupements jour / semaine / mois ---
const isoOf = (d) => d.toISOString().slice(0, 10);
const TODAY_ISO = isoOf(today);
const startOfWeekMon = (d) => { const x = new Date(d); const wd = (x.getDay() + 6) % 7; x.setDate(x.getDate() - wd); x.setHours(0, 0, 0, 0); return x; };
const weekKeyOf = (iso) => isoOf(startOfWeekMon(new Date(iso)));
const isoWeekNum = (d0) => {
  const d = new Date(Date.UTC(d0.getFullYear(), d0.getMonth(), d0.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThu = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  return 1 + Math.round(((d - firstThu) / 864e5 - 3 + ((firstThu.getUTCDay() + 6) % 7)) / 7);
};
const frWeekRange = (startIso) => {
  const s = new Date(startIso), e = new Date(s); e.setDate(e.getDate() + 6);
  const f = (x) => x.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  return `${f(s)} – ${f(e)}`;
};
const frDayLong = (iso) => { const s = new Date(iso).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }); return s.charAt(0).toUpperCase() + s.slice(1); };
const MOIS_ABBR = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const moisLabelFromDate = (iso) => { const d = new Date(iso); return `${MOIS_ABBR[d.getMonth()]}-${String(d.getFullYear()).slice(2)}`; };
const moisLongFromDate = (iso) => { const s = new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }); return s.charAt(0).toUpperCase() + s.slice(1); };
const topSource = (list) => { const c = {}; list.forEach((p) => (c[p.source] = (c[p.source] || 0) + 1)); const e = Object.entries(c).sort((a, b) => b[1] - a[1])[0]; return e ? e[0] : "—"; };

/* ============================================================= *
 *  COMPOSANTS PARTAGÉS
 * ============================================================= */
function Badge({ color, bg, children, dot }) {
  return (
    <span className="badge" style={{ color, background: bg }}>
      {dot && <span className="dot" style={{ background: color }} />}
      {children}
    </span>
  );
}

function Kpi({ label, value, sub, icon: Icon, accent = "var(--brand)", chipBg, trend }) {
  return (
    <div className="card kpi" style={{ "--accent": accent }}>
      <div className="card-pad">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="kpi-label">{label}</div>
          {Icon && (
            <div className="ico-chip" style={{ background: chipBg || "var(--brand-50)" }}>
              <Icon size={17} color={accent} />
            </div>
          )}
        </div>
        <div className="num kpi-val">{value}</div>
        {sub && (
          <div className="kpi-sub">
            {trend === "up" && <ArrowUpRight size={13} className="trend-up" />}
            {trend === "down" && <ArrowDownRight size={13} className="trend-down" />}
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function Gauge({ value, max, label }) {
  const pct = Math.min(1, value / max);
  const reached = value >= max;
  const C = 2 * Math.PI * 52;
  const color = reached ? "#029393" : pct > 0.7 ? "#b5760a" : "#e02436";
  return (
    <div className="gauge-wrap">
      <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="75" cy="75" r="52" fill="none" stroke="var(--surface-3)" strokeWidth="13" />
        <circle cx="75" cy="75" r="52" fill="none" stroke={color} strokeWidth="13" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div style={{ marginTop: -100, textAlign: "center", pointerEvents: "none" }}>
        <div className="num" style={{ fontSize: 22, fontWeight: 700, color }}>{Math.round(pct * 100)}%</div>
        <div className="faint" style={{ fontSize: 11 }}>{label}</div>
      </div>
      <div style={{ marginTop: 60, textAlign: "center" }}>
        <div className="num" style={{ fontWeight: 700, fontSize: 15 }}>{fmtE(value)}</div>
        <div className="faint" style={{ fontSize: 11.5 }}>objectif {fmtE(max)}</div>
      </div>
    </div>
  );
}

function ChartTip({ active, payload, label, fmt = fmtE }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 10, padding: "9px 12px", boxShadow: "var(--shadow-lg)", fontSize: 12.5 }}>
      {label && <div style={{ fontWeight: 700, marginBottom: 5 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--ink-2)" }}>
          <span className="dot" style={{ background: p.color || p.fill }} />
          <span>{p.name}</span>
          <span className="num" style={{ fontWeight: 700, color: "var(--ink)", marginLeft: "auto" }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================= *
 *  VUE — TABLEAU DE BORD
 * ============================================================= */
function Dashboard({ prospects, factures, depenses, tva, goto }) {
  const m = useMemo(() => {
    const byStage = {};
    STAGES.forEach((s) => (byStage[s.id] = prospects.filter((p) => p.stage === s.id)));
    const ouverts = prospects.filter(isOpen);
    const pipelineTotal = ouverts.reduce((a, p) => a + p.montant, 0);
    const pondere = ouverts.reduce((a, p) => a + p.montant * (p.proba / 100), 0);
    const gagnes = byStage.gagne.length, perdus = byStage.perdu.length;
    const conv = gagnes + perdus > 0 ? gagnes / (gagnes + perdus) : 0;
    const aRelancer = ouverts
      .filter((p) => daysSince(p.derniereRelance) >= 5)
      .sort((a, b) => daysSince(b.derniereRelance) - daysSince(a.derniereRelance));
    const caGagne = byStage.gagne.reduce((a, p) => a + p.montant, 0);

    // finances mensuelles
    const mset = {};
    factures.forEach((f) => {
      if (f.annulee) return;
      mset[f.mois] = mset[f.mois] || { mois: f.mois, ca: 0, coutVar: 0 };
      mset[f.mois].ca += f.montantHT; mset[f.mois].coutVar += f.coutVar;
    });
    depenses.forEach((d) => { mset[d.mois] = mset[d.mois] || { mois: d.mois, ca: 0, coutVar: 0 }; mset[d.mois].charges = (mset[d.mois].charges || 0) + d.montant; });
    const monthly = Object.values(mset)
      .map((x) => ({ ...x, charges: x.charges || 0, mb: x.ca - x.coutVar, resultat: x.ca - x.coutVar - (x.charges || 0), objectif: 27000 }))
      .sort((a, b) => moisOrder(a.mois) - moisOrder(b.mois));
    const caTotal = factures.reduce((a, f) => a + (f.annulee ? 0 : f.montantHT), 0);
    const mbTotal = factures.reduce((a, f) => a + (f.annulee ? 0 : f.montantHT - f.coutVar), 0);
    const moisCourant = monthly.find((x) => x.mois === "juin-26") || monthly[monthly.length - 1] || { ca: 0 };
    return { byStage, pipelineTotal, pondere, conv, aRelancer, caGagne, monthly, caTotal, mbTotal, moisCourant, ouverts: ouverts.length };
  }, [prospects, factures, depenses]);

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <Kpi label="Pipeline ouvert" value={fmtE(m.pipelineTotal)} sub={`${m.ouverts} prospects actifs`} icon={CircleDollarSign} accent="#00b4bc" chipBg="#e3f6f7" />
        <Kpi label="Montant pondéré" value={fmtE(m.pondere)} sub="montant × probabilité" icon={Target} accent="#ef7507" chipBg="#fdeede" />
        <Kpi label="Taux de conversion" value={fmtPct(m.conv)} sub={`${m.byStage.gagne.length} gagnés / ${m.byStage.perdu.length} perdus`} icon={Percent} accent="#029393" chipBg="#e0f3f3" trend="up" />
        <Kpi label="CA signé (cumul)" value={fmtE(m.caTotal)} sub={`réalisé + à venir · marge ${fmtE(m.mbTotal)}`} icon={Banknote} accent="#e02436" chipBg="#fdeaec" trend="up" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.1fr 1.6fr", marginTop: 16, alignItems: "stretch" }}>
        <div className="card card-pad">
          <div className="eyebrow">Atterrissage du mois</div>
          <h3 style={{ fontSize: 15, margin: "3px 0 12px" }}>Point mort — juin 2026</h3>
          <Gauge value={m.moisCourant.ca} max={27000} label="du point mort" />
          <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--ink-2)", textAlign: "center", lineHeight: 1.5 }}>
            {m.moisCourant.ca >= 27000
              ? "Point mort atteint : le mois est rentable. 🎯"
              : `Encore ${fmtE(27000 - m.moisCourant.ca)} de CA à réaliser pour couvrir les charges.`}
          </div>
        </div>

        <div className="card card-pad col">
          <div className="section-title" style={{ margin: 0 }}>
            <div>
              <div className="eyebrow">Performance</div>
              <h3 style={{ fontSize: 15, marginTop: 3 }}>CA & marge vs objectif</h3>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 230, marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={m.monthly} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis dataKey="mois" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} tickLine={false} axisLine={false} width={42} />
                <Tooltip content={<ChartTip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="ca" name="CA réalisé" fill="#e02436" radius={[5, 5, 0, 0]} maxBarSize={34} />
                <Bar dataKey="mb" name="Marge brute" fill="#ff9aa2" radius={[5, 5, 0, 0]} maxBarSize={34} />
                <Line dataKey="objectif" name="Objectif (27 k€)" stroke="#e02436" strokeWidth={2} strokeDasharray="5 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", marginTop: 16, alignItems: "start" }}>
        <div className="card">
          <div className="card-pad" style={{ paddingBottom: 4 }}>
            <div className="eyebrow">Pipeline commercial</div>
            <h3 style={{ fontSize: 15, marginTop: 3 }}>Entonnoir par étape</h3>
          </div>
          <div className="card-pad" style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 11 }}>
            {STAGES.filter((s) => s.id !== "npertinent").map((s) => {
              const list = m.byStage[s.id];
              const val = list.reduce((a, p) => a + p.montant, 0);
              const maxVal = Math.max(1, ...STAGES.filter((x) => x.id !== "npertinent").map((x) => m.byStage[x.id].reduce((a, p) => a + p.montant, 0)));
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 118, flexShrink: 0, display: "flex", alignItems: "center", gap: 7 }}>
                    <span className="dot" style={{ background: s.color }} />
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{s.label}</span>
                  </div>
                  <div className="bar-track">
                    <div style={{ height: "100%", width: `${(val / maxVal) * 100}%`, background: s.color, borderRadius: 99, minWidth: val > 0 ? 4 : 0, transition: ".4s" }} />
                  </div>
                  <div style={{ width: 96, textAlign: "right", flexShrink: 0 }}>
                    <span className="num" style={{ fontWeight: 700, fontSize: 13 }}>{fmtE(val)}</span>
                    <span className="faint" style={{ fontSize: 11, marginLeft: 6 }}>{list.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-pad" style={{ paddingBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="eyebrow">Action requise</div>
              <h3 style={{ fontSize: 15, marginTop: 3, display: "flex", alignItems: "center", gap: 7 }}>
                <Bell size={15} color="var(--gold)" /> À relancer
              </h3>
            </div>
            <span className="badge" style={{ color: "var(--gold)", background: "var(--gold-50)" }}>{m.aRelancer.length}</span>
          </div>
          <div style={{ maxHeight: 268, overflowY: "auto" }}>
            {m.aRelancer.length === 0 && <div className="empty">Aucun prospect à relancer. 👍</div>}
            {m.aRelancer.map((p) => (
              <div key={p.id} onClick={() => goto("crm", p.id)}
                style={{ padding: "11px 18px", borderTop: "1px solid var(--line-2)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.entreprise}</div>
                  <div className="faint" style={{ fontSize: 11.5 }}>
                    {formById(p.formationId)?.code} · relancé il y a {daysSince(p.derniereRelance)} j
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="num" style={{ fontWeight: 700, fontSize: 12.5 }}>{fmtE(p.montant)}</div>
                  <Badge color={stageById(p.stage).color} bg={stageById(p.stage).bg}>{stageById(p.stage).label}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================= *
 *  VUE — CRM PIPELINE (Kanban + fiche)
 * ============================================================= */
function ProspectCard({ p, onDragStart, onDragEnd, dragging, onClick }) {
  const st = stageById(p.stage);
  const f = formById(p.formationId);
  const palier = palierRelance(p);
  const overdue = !!palier;
  return (
    <div className={`pcard ${dragging ? "dragging" : ""}`} style={{ "--accent": f?.color }}
      draggable onDragStart={(e) => onDragStart(e, p.id)} onDragEnd={onDragEnd} onClick={() => onClick(p)}>
      <div className="pcard-co">
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.entreprise}</span>
        {palier && <Bell size={13} color={palier.color} style={{ flexShrink: 0 }} title={`${palier.label} — ${palier.ton}`} />}
      </div>
      <div className="pcard-ct">{p.contact}</div>
      <div style={{ marginTop: 9, display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span className="tag" style={{ color: f?.color, borderColor: f?.color + "44" }}>{f?.code}</span>
        <span className="tag" style={{ color: origineCouleur(p), borderColor: origineCouleur(p) + "44" }}>{origineCourt(p)}</span>
      </div>
      {p.stage === "perdu" ? (
        <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--st-lost)", display: "flex", alignItems: "center", gap: 5 }}>
          <X size={12} /> {p.motifPerte || "Perdu"}
        </div>
      ) : p.stage === "npertinent" ? (
        <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--st-na)", display: "flex", alignItems: "center", gap: 5 }}>
          <Ban size={12} /> {p.motifPerte || "Sans suite"}
        </div>
      ) : (
        <>
          <div className="proba-bar"><div className="proba-fill" style={{ width: `${p.proba}%` }} /></div>
          <div className="pcard-meta">
            <span className="num" style={{ fontWeight: 700, fontSize: 14 }}>{fmtE(p.montant)}</span>
            <span className="faint num" style={{ fontSize: 12 }}>{p.proba}%</span>
          </div>
        </>
      )}
    </div>
  );
}

function ProspectDrawer({ p, onClose, onUpdate, onDelete, onConvert }) {
  const [note, setNote] = useState("");
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(p);
  useEffect(() => { setDraft(p); setEdit(false); }, [p.id]);
  if (!p) return null;
  const st = stageById(p.stage), f = formById(p.formationId);

  const addNote = () => {
    if (!note.trim()) return;
    onUpdate({ ...p, derniereRelance: today.toISOString().slice(0, 10), notes: [...p.notes, { date: today.toISOString().slice(0, 10), txt: note.trim() }] });
    setNote("");
  };
  const save = () => { onUpdate({ ...draft, montant: +draft.montant, proba: +draft.proba }); setEdit(false); };

  const Field = ({ label, children }) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--line-2)", fontSize: 13 }}>
      <span className="faint">{label}</span><span style={{ fontWeight: 600, textAlign: "right" }}>{children}</span>
    </div>
  );

  return (
    <div className="scrim" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div style={{ minWidth: 0 }}>
            <Badge color={st.color} bg={st.bg} dot>{st.label}</Badge>
            <h3 style={{ fontSize: 18, marginTop: 8 }}>{p.entreprise}</h3>
            <div className="muted" style={{ fontSize: 13 }}>{p.contact}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-icon" onClick={() => setEdit(!edit)} title="Modifier"><Pencil size={15} /></button>
            <button className="btn btn-icon" onClick={() => { if (confirm("Supprimer ce prospect ?")) onDelete(p.id); }} title="Supprimer"><Trash2 size={15} /></button>
            <button className="btn btn-icon" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div className="drawer-body">
          {!edit ? (
            <>
              <div className="card card-pad">
                <div className="eyebrow" style={{ marginBottom: 4 }}>Coordonnées</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 8 }}>
                  <a href={`mailto:${p.email}`} style={{ display: "flex", alignItems: "center", gap: 9, color: "var(--brand)", fontSize: 13, textDecoration: "none", fontWeight: 500 }}><Mail size={15} />{p.email}</a>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}><Phone size={15} color="var(--ink-3)" />{p.tel}</div>
                </div>
              </div>

              <div className="card card-pad">
                <div className="eyebrow" style={{ marginBottom: 4 }}>Opportunité</div>
                <Field label="Formation"><span style={{ color: f?.color }}>{f?.code}</span> — {f?.nom}</Field>
                <Field label="Montant estimé"><span className="num">{fmtE(p.montant)}</span></Field>
                <Field label="Probabilité"><span className="num">{p.proba} %</span></Field>
                <Field label="Montant pondéré"><span className="num">{fmtE(p.montant * p.proba / 100)}</span></Field>
                <Field label="Origine du lead"><span style={{ color: origineCouleur(p), fontWeight: 600 }}>{origineLabel(p)}</span></Field>
                {(p.stage === "perdu" || p.stage === "npertinent") && (
                  <div style={{ paddingTop: 10 }}>
                    <div className="faint" style={{ fontSize: 12, marginBottom: 6 }}>{p.stage === "perdu" ? "Cause du refus" : "Motif (non pertinent)"}</div>
                    <MotifSelect key={p.id} value={p.motifPerte || ""} onChange={(v) => onUpdate({ ...p, motifPerte: v })} />
                  </div>
                )}
                {p.stage === "gagne" && onConvert && (
                  <button className="btn btn-primary" style={{ width: "100%", marginTop: 12, justifyContent: "center" }} onClick={() => { onConvert(p); onClose(); }}>
                    <CalendarRange size={15} /> Créer la session (devis gagné)
                  </button>
                )}
              </div>

              <div className="card card-pad">
                <div className="eyebrow" style={{ marginBottom: 4 }}>Échéancier</div>
                <Field label="Créé le">{frDate(p.dateCreation)}</Field>
                <Field label="Dernière relance">{frDate(p.derniereRelance)} <span className="faint">· il y a {daysSince(p.derniereRelance)} j</span></Field>
                <Field label="Signature prévue">{frDate(p.dateSignaturePrevue)}</Field>
              </div>

              <div className="card card-pad">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 6 }}><StickyNote size={13} /> Historique des échanges</div>
                  <span className="faint" style={{ fontSize: 11 }}>{p.notes.length} note{p.notes.length > 1 ? "s" : ""}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                  {[...p.notes].reverse().map((n, i) => (
                    <div className="note" key={i}>
                      <div className="note-date">{frDate(n.date)}</div>{n.txt}
                    </div>
                  ))}
                  {p.notes.length === 0 && <div className="empty" style={{ padding: 16 }}>Aucun échange consigné.</div>}
                </div>
                <textarea className="input" placeholder="Ajouter une note / consigner une relance…" value={note} onChange={(e) => setNote(e.target.value)} />
                <button className="btn btn-primary btn-sm" style={{ marginTop: 9 }} onClick={addNote}><Plus size={14} /> Ajouter & marquer relancé</button>
              </div>

              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Déplacer vers</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {STAGES.map((s) => (
                    <button key={s.id} className="btn btn-sm" disabled={s.id === p.stage}
                      style={{ borderColor: s.id === p.stage ? s.color : "var(--line)", color: s.id === p.stage ? s.color : "var(--ink-2)", background: s.id === p.stage ? s.bg : "var(--surface)", opacity: s.id === p.stage ? 1 : .9 }}
                      onClick={() => onUpdate({ ...p, stage: s.id })}>{s.label}</button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div className="eyebrow">Modifier le prospect</div>
              <div className="form-grid">
                <div className="field"><label>Contact</label><input className="input" value={draft.contact} onChange={(e) => setDraft({ ...draft, contact: e.target.value })} /></div>
                <div className="field"><label>Entreprise</label><input className="input" value={draft.entreprise} onChange={(e) => setDraft({ ...draft, entreprise: e.target.value })} /></div>
                <div className="field"><label>Email</label><input className="input" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
                <div className="field"><label>Téléphone</label><input className="input" value={draft.tel} onChange={(e) => setDraft({ ...draft, tel: e.target.value })} /></div>
                <div className="field"><label>Formation</label>
                  <select className="select" value={draft.formationId} onChange={(e) => setDraft({ ...draft, formationId: e.target.value })}>
                    {FORMATIONS.map((f) => <option key={f.id} value={f.id}>{f.code} — {f.nom}</option>)}
                  </select></div>
                <ChampOrigine value={draft.origineId} detail={draft.origineDetail}
                  onChange={(id, det) => setDraft({ ...draft, origineId: id, origineDetail: det,
                    source: (origineById(id) || {}).canal || draft.source })} />
                <div className="field"><label>Montant estimé (€)</label><input className="input num" type="number" value={draft.montant} onChange={(e) => setDraft({ ...draft, montant: e.target.value })} /></div>
                <div className="field"><label>Probabilité (%)</label><input className="input num" type="number" min="0" max="100" value={draft.proba} onChange={(e) => setDraft({ ...draft, proba: e.target.value })} /></div>
                <div className="field"><label>Date de décrochage</label><input className="input" type="date" value={draft.dateCreation} onChange={(e) => setDraft({ ...draft, dateCreation: e.target.value })} /></div>
                <div className="field"><label>Dernière relance</label><input className="input" type="date" value={draft.derniereRelance} onChange={(e) => setDraft({ ...draft, derniereRelance: e.target.value })} /></div>
                <div className="field"><label>Signature prévue</label><input className="input" type="date" value={draft.dateSignaturePrevue} onChange={(e) => setDraft({ ...draft, dateSignaturePrevue: e.target.value })} /></div>
                <div className="field"><label>Étape</label>
                  <select className="select" value={draft.stage} onChange={(e) => setDraft({ ...draft, stage: e.target.value })}>
                    {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select></div>
              </div>
              {(draft.stage === "perdu" || draft.stage === "npertinent") && (
                <div className="field"><label>{draft.stage === "perdu" ? "Cause du refus" : "Motif (non pertinent)"}</label><MotifSelect key={p.id + draft.stage} value={draft.motifPerte || ""} onChange={(v) => setDraft({ ...draft, motifPerte: v })} /></div>
              )}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn" onClick={() => { setDraft(p); setEdit(false); }}>Annuler</button>
                <button className="btn btn-primary" onClick={save}>Enregistrer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MotifSelect({ value, onChange }) {
  const presets = MOTIFS_REFUS.filter((m) => m !== "Autre");
  const [autre, setAutre] = useState(!!value && !presets.includes(value));
  const selVal = autre ? "Autre" : (presets.includes(value) ? value : "");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, width: "100%" }}>
      <select className="select" value={selVal} onChange={(e) => {
        const v = e.target.value;
        if (v === "Autre") { setAutre(true); onChange(""); }
        else { setAutre(false); onChange(v); }
      }}>
        <option value="">— Choisir une cause —</option>
        {presets.map((m) => <option key={m} value={m}>{m}</option>)}
        <option value="Autre">Autre (préciser)…</option>
      </select>
      {autre && <input className="input" autoFocus placeholder="Préciser la cause…" value={value} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

// Sélecteur d'origine, avec la précision « Lequel ? » pour un client récurrent.
function ChampOrigine({ value, detail, onChange, label = "Origine du lead" }) {
  const o = origineById(value);
  return (
    <>
      <div className="field"><label>{label}</label>
        <select className="select" value={value || ""}
          onChange={(e) => onChange(e.target.value || null, e.target.value === "client_recurrent" ? (detail || "") : "")}>
          <option value="">— à préciser —</option>
          {ORIGINES_LEAD.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
        </select></div>
      {o && o.precision && (
        <div className="field"><label>{o.precision}</label>
          <input className="input" placeholder="Nom du client récurrent"
            value={detail || ""} onChange={(e) => onChange(value, e.target.value)} /></div>
      )}
    </>
  );
}

function NewProspectModal({ onClose, onCreate }) {
  const [d, setD] = useState({
    contact: "", entreprise: "", email: "", tel: "", formationId: "afgsu2",
    montant: "", proba: 30, source: "Site web", origineId: null, origineDetail: "", stage: "nouveau",
    dateCreation: TODAY_ISO, dateSignaturePrevue: "", motifPerte: "", notes: "",
  });
  const set = (k, v) => setD({ ...d, [k]: v });
  const create = () => {
    if (!d.entreprise.trim()) { alert("L'entreprise est obligatoire."); return; }
    const iso = today.toISOString().slice(0, 10);
    onCreate({
      id: uid("p"), ...d, montant: +d.montant || 0, proba: +d.proba || 0,
      dateCreation: d.dateCreation || iso, derniereRelance: d.dateCreation || iso,
      notes: d.notes.trim() ? [{ date: d.dateCreation || iso, txt: d.notes.trim() }] : [],
    });
    onClose();
  };
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 style={{ fontSize: 17 }}>Nouveau prospect</h3>
          <button className="btn btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="field"><label>Entreprise *</label><input className="input" autoFocus value={d.entreprise} onChange={(e) => set("entreprise", e.target.value)} /></div>
            <div className="field"><label>Contact</label><input className="input" value={d.contact} onChange={(e) => set("contact", e.target.value)} /></div>
            <div className="field"><label>Email</label><input className="input" type="email" value={d.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div className="field"><label>Téléphone</label><input className="input" value={d.tel} onChange={(e) => set("tel", e.target.value)} /></div>
            <div className="field"><label>Formation</label>
              <select className="select" value={d.formationId} onChange={(e) => set("formationId", e.target.value)}>
                {FORMATIONS.map((f) => <option key={f.id} value={f.id}>{f.code} — {f.nom}</option>)}
              </select></div>
            <ChampOrigine value={d.origineId} detail={d.origineDetail}
              onChange={(id, det) => setD({ ...d, origineId: id, origineDetail: det,
                source: (origineById(id) || {}).canal || d.source })} />
            <div className="field"><label>Montant estimé (€)</label><input className="input num" type="number" value={d.montant} onChange={(e) => set("montant", e.target.value)} /></div>
            <div className="field"><label>Probabilité (%)</label><input className="input num" type="number" min="0" max="100" value={d.proba} onChange={(e) => set("proba", e.target.value)} /></div>
            <div className="field"><label>Étape initiale</label>
              <select className="select" value={d.stage} onChange={(e) => set("stage", e.target.value)}>{STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
            <div className="field"><label>Date de décrochage</label><input className="input" type="date" value={d.dateCreation} onChange={(e) => set("dateCreation", e.target.value)} /></div>
            <div className="field"><label>Signature prévue</label><input className="input" type="date" value={d.dateSignaturePrevue} onChange={(e) => set("dateSignaturePrevue", e.target.value)} /></div>
          </div>
          {(d.stage === "perdu" || d.stage === "npertinent") && (
            <div className="field" style={{ marginTop: 14 }}><label>Cause du refus</label><MotifSelect value={d.motifPerte} onChange={(v) => set("motifPerte", v)} /></div>
          )}
          <div className="field" style={{ marginTop: 14 }}><label>Première note</label><textarea className="input" value={d.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Contexte, besoin exprimé…" /></div>
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={create}><Plus size={15} /> Créer le prospect</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================= *
 *  RELANCES — prospects « Nouveau » et « Devis en cours » dont la
 *  dernière relance dépasse J+3, J+9, J+15 ou J+30.
 *  Chaque ligne se traite sans quitter la page : relance notée du
 *  jour, passage en gagné ou en perdu.
 * ============================================================= */
function PanneauRelances({ prospects, setProspects, onOuvrir }) {
  const [ouvert, setOuvert] = useState(true);
  const [palierFiltre, setPalierFiltre] = useState("");

  const lignes = useMemo(() => (prospects || [])
    .map((p) => ({ p, pal: palierRelance(p) }))
    .filter((x) => x.pal && (!palierFiltre || x.pal.label === palierFiltre))
    .sort((a, b) => b.pal.jours - a.pal.jours), [prospects, palierFiltre]);

  const parPalier = useMemo(() => {
    const c = {};
    (prospects || []).forEach((p) => { const pa = palierRelance(p); if (pa) c[pa.label] = (c[pa.label] || 0) + 1; });
    return c;
  }, [prospects]);

  const total = Object.values(parPalier).reduce((a, b) => a + b, 0);
  const maj = (id, patch) => setProspects((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const noterRelance = (p) => maj(p.id, { derniereRelance: TODAY_ISO });
  const marquer = (p, stage) => {
    if (stage === "perdu" && !p.motifPerte) {
      const m = window.prompt("Cause du refus (facultatif) :", "");
      maj(p.id, { stage, proba: 0, motifPerte: m || "" });
    } else {
      maj(p.id, stage === "gagne" ? { stage, proba: 100 } : { stage, proba: 0 });
    }
  };

  if (!total) {
    return (
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <h3><Bell size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />Relances</h3>
        </div>
        <p style={{ padding: "0 16px 16px", margin: 0, color: "var(--ink-3)", fontSize: 13 }}>
          Aucune relance due. Les prospects « Nouveau » et « Devis en cours » remontent ici à J+3, J+9, J+15 puis J+30.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-head">
        <h3><Bell size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />
          Relances <span className="faint" style={{ fontWeight: 500 }}>· {total} prospect{total > 1 ? "s" : ""}</span></h3>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: "auto", flexWrap: "wrap" }}>
          {PALIERS_RELANCE.map((pa) => (
            <button key={pa.label} className="tag" onClick={() => setPalierFiltre(palierFiltre === pa.label ? "" : pa.label)}
              title={pa.ton}
              style={{ cursor: "pointer", color: pa.color, borderColor: pa.color + "44",
                background: palierFiltre === pa.label ? pa.color + "18" : "transparent",
                opacity: parPalier[pa.label] ? 1 : 0.4 }}>
              {pa.label} · {parPalier[pa.label] || 0}
            </button>
          ))}
          <button className="btn btn-sm" onClick={() => setOuvert(!ouvert)}>
            {ouvert ? "Replier" : "Déplier"}
          </button>
        </div>
      </div>

      {ouvert && (
        <div className="scroll-x">
          <table className="table">
            <thead>
              <tr>
                <th>Alerte</th><th>Prospect</th><th>Formation</th><th>Origine</th>
                <th className="t-right">Montant</th><th>Dernière relance</th><th>Étape</th><th></th>
              </tr>
            </thead>
            <tbody>
              {lignes.map(({ p, pal }) => (
                <tr key={p.id}>
                  <td>
                    <span className="tag" style={{ color: pal.color, borderColor: pal.color + "44", fontWeight: 700 }}>
                      {pal.label}
                    </span>
                    <div className="faint" style={{ fontSize: 11, marginTop: 3 }}>{pal.ton}</div>
                  </td>
                  <td>
                    <button className="lien" onClick={() => onOuvrir(p)}
                      style={{ background: "none", border: 0, padding: 0, cursor: "pointer",
                        font: "inherit", fontWeight: 600, color: "var(--ink)", textAlign: "left" }}>
                      {p.entreprise}
                    </button>
                    <div className="faint" style={{ fontSize: 11.5 }}>{p.contact || "—"}</div>
                  </td>
                  <td><span style={{ color: formById(p.formationId)?.color }}>{formById(p.formationId)?.code || "—"}</span></td>
                  <td><span style={{ color: origineCouleur(p), fontSize: 12 }}>{origineCourt(p)}</span></td>
                  <td className="t-right num">{fmtE(p.montant)}</td>
                  <td>{frDate(p.derniereRelance || p.dateCreation)}
                    <div className="faint" style={{ fontSize: 11 }}>il y a {pal.jours} j</div></td>
                  <td><span className="tag" style={{ color: stageById(p.stage).color }}>{stageById(p.stage).label}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 5, justifyContent: "flex-end", flexWrap: "wrap" }}>
                      <button className="btn btn-sm" title="Enregistrer une relance effectuée aujourd'hui"
                        onClick={() => noterRelance(p)}><RotateCcw size={13} /> Relancé</button>
                      <button className="btn btn-sm" title="Passer en gagné"
                        style={{ color: "var(--st-won)", borderColor: "var(--st-won)44" }}
                        onClick={() => marquer(p, "gagne")}><CheckCircle2 size={13} /> Gagné</button>
                      <button className="btn btn-sm" title="Passer en perdu"
                        style={{ color: "var(--st-lost)", borderColor: "var(--st-lost)44" }}
                        onClick={() => marquer(p, "perdu")}><X size={13} /> Perdu</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CRM({ prospects, setProspects, setFactures, focusId, clearFocus }) {
  const [draggingId, setDraggingId] = useState(null);
  const [overCol, setOverCol] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [query, setQuery] = useState("");
  const [srcFilter, setSrcFilter] = useState("");
  const [converting, setConverting] = useState(null);

  const sourceToOrigine = (src) => {
    const map = { "Client récurent": "CLIENT RECURENT", "Partenaire": "PARTENAIRE", "Dentall Project": "DENTALL PROJECT", "LONASANTE": "LONASANTE", "INTER CDF": "INTER CDF", "LABOFORM": "LABOFORM", "ADWORDS": "ADWORDS" };
    return map[src] || (ORIGINES.includes(src) ? src : "PARTENAIRE");
  };
  const convertPrefill = (p) => ({
    client: p.entreprise || p.contact || "", formationId: p.formationId || "afgsu2",
    origine: sourceToOrigine(p.source), base: "Groupe", forfait: p.montant ? String(p.montant) : "",
    statut: "attente", date: TODAY_ISO,
  });

  useEffect(() => {
    if (focusId) { const p = prospects.find((x) => x.id === focusId); if (p) setSelected(p); clearFocus(); }
  }, [focusId]);
  useEffect(() => {
    if (selected) { const fresh = prospects.find((x) => x.id === selected.id); if (fresh && fresh !== selected) setSelected(fresh); }
  }, [prospects]);

  const filtered = prospects.filter((p) => {
    const q = query.toLowerCase();
    const matchQ = !q || p.entreprise.toLowerCase().includes(q) || p.contact.toLowerCase().includes(q);
    const matchS = !srcFilter || (srcFilter === "__vide" ? !p.origineId : p.origineId === srcFilter);
    return matchQ && matchS;
  });

  const onDragStart = (e, id) => { setDraggingId(id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", id); };
  const onDragEnd = () => { setDraggingId(null); setOverCol(null); };
  const onDrop = (e, stage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, stage } : p)));
    setDraggingId(null); setOverCol(null);
  };

  const update = (np) => setProspects((prev) => prev.map((p) => (p.id === np.id ? np : p)));
  const remove = (id) => { setProspects((prev) => prev.filter((p) => p.id !== id)); setSelected(null); };

  const totalOuvert = prospects.filter(isOpen).reduce((a, p) => a + p.montant, 0);
  const aPreciser = prospects.filter((p) => !p.origineId).length;

  return (
    <>
      <div className="section-title">
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={15} color="var(--ink-3)" style={{ position: "absolute", left: 11, top: 10 }} />
            <input className="input" style={{ paddingLeft: 32, width: 230 }} placeholder="Rechercher…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select className="select" style={{ width: 200 }} value={srcFilter} onChange={(e) => setSrcFilter(e.target.value)}>
            <option value="">Toutes les origines</option>
            {ORIGINES_LEAD.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            <option value="__vide">Origine à préciser</option>
          </select>
          <span className="faint" style={{ fontSize: 12.5 }}>Pipeline ouvert : <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>{fmtE(totalOuvert)}</span></span>
          {aPreciser > 0 && (
            <button className="tag" title="Afficher les prospects dont l'origine n'est pas renseignée"
              onClick={() => setSrcFilter(srcFilter === "__vide" ? "" : "__vide")}
              style={{ cursor: "pointer", color: "var(--gold)", borderColor: "var(--gold)44",
                background: srcFilter === "__vide" ? "var(--gold)18" : "transparent" }}>
              <AlertTriangle size={12} /> {aPreciser} origine{aPreciser > 1 ? "s" : ""} à préciser
            </button>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}><Plus size={16} /> Nouveau prospect</button>
      </div>

      <PanneauRelances prospects={prospects} setProspects={setProspects} onOuvrir={(p) => setSelected(p)} />

      <div className="board" style={{ gridTemplateColumns: `repeat(${STAGES.length}, minmax(196px, 1fr))` }}>
        {STAGES.map((s) => {
          const list = filtered.filter((p) => p.stage === s.id);
          const sum = list.reduce((a, p) => a + p.montant, 0);
          return (
            <div key={s.id} className={`col-k ${overCol === s.id ? "over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setOverCol(s.id); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOverCol(null); }}
              onDrop={(e) => onDrop(e, s.id)}>
              <div className="col-head">
                <div className="col-title"><span className="dot" style={{ background: s.color }} />{s.label}</div>
                <span className="col-count" style={{ color: s.color }}>{list.length}</span>
              </div>
              <div className="col-sum">Σ <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>{fmtE(sum)}</span></div>
              <div className="col-body">
                {list.map((p) => (
                  <ProspectCard key={p.id} p={p} dragging={draggingId === p.id} onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={setSelected} />
                ))}
                {list.length === 0 && <div style={{ padding: "16px 8px", textAlign: "center", color: "var(--ink-3)", fontSize: 12 }}>Déposez un prospect ici</div>}
              </div>
            </div>
          );
        })}
      </div>

      {selected && <ProspectDrawer p={selected} onClose={() => setSelected(null)} onUpdate={update} onDelete={remove} onConvert={setFactures ? (p) => setConverting(p) : null} />}
      {converting && <SessionModal session={null} prefill={convertPrefill(converting)} onClose={() => setConverting(null)} onSave={(s) => { setFactures((prev) => [...prev, s]); setConverting(null); }} />}
      {showNew && <NewProspectModal onClose={() => setShowNew(false)} onCreate={(p) => setProspects((prev) => [p, ...prev])} />}
    </>
  );
}

/* ============================================================= *
 *  VUE — COMPTABILITÉ
 * ============================================================= */
function NewDepenseModal({ onClose, onCreate }) {
  const cats = ["Salaires", "Loyer", "Logiciels", "Honoraires", "Assurances", "Télécom", "Marketing", "Supports", "Autres"];
  const [d, setD] = useState({ libelle: "", categorie: "Autres", mois: "juin-26", date: "2026-06-30", montant: "", canal: "" });
  const set = (k, v) => setD({ ...d, [k]: v });
  const create = () => {
    if (!d.libelle.trim() || !d.montant) { alert("Libellé et montant obligatoires."); return; }
    onCreate({ id: uid("d"), ...d, montant: +d.montant });
    onClose();
  };
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><h3 style={{ fontSize: 17 }}>Nouvelle dépense</h3><button className="btn btn-icon" onClick={onClose}><X size={16} /></button></div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="field"><label>Libellé *</label><input className="input" autoFocus value={d.libelle} onChange={(e) => set("libelle", e.target.value)} /></div>
            <div className="field"><label>Catégorie</label><select className="select" value={d.categorie} onChange={(e) => set("categorie", e.target.value)}>{cats.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div className="field"><label>Mois</label><select className="select" value={d.mois} onChange={(e) => set("mois", e.target.value)}>{MOIS.map((m) => <option key={m}>{m}</option>)}</select></div>
            <div className="field"><label>Date</label><input className="input" type="date" value={d.date} onChange={(e) => set("date", e.target.value)} /></div>
            <div className="field"><label>Montant (€)</label><input className="input num" type="number" value={d.montant} onChange={(e) => set("montant", e.target.value)} /></div>
            {d.categorie === "Marketing" && <div className="field"><label>Canal</label><input className="input" value={d.canal} onChange={(e) => set("canal", e.target.value)} placeholder="ADWORDS, LONASANTE…" /></div>}
          </div>
        </div>
        <div className="modal-foot"><button className="btn" onClick={onClose}>Annuler</button><button className="btn btn-primary" onClick={create}><Plus size={15} /> Enregistrer</button></div>
      </div>
    </div>
  );
}

const CAT_COLORS = { Salaires: "#00b4bc", Loyer: "#ef7507", Logiciels: "#029393", Honoraires: "#029393", Assurances: "#b5760a", "Télécom": "#ff838f", Marketing: "#e02436", Supports: "#8a9b9a", Autres: "#4a5b58" };

function Comptabilite({ factures, setFactures, depenses, setDepenses, tva, setTva }) {
  const [sub, setSub] = useState("synthese");
  const [showFact, setShowFact] = useState(false);
  const [showDep, setShowDep] = useState(false);

  const data = useMemo(() => {
    const mset = {};
    const ensure = (m) => (mset[m] = mset[m] || { mois: m, caHT: 0, coutVar: 0, charges: 0 });
    factures.forEach((f) => { if (f.annulee) return; const x = ensure(f.mois); x.caHT += f.montantHT; x.coutVar += f.coutVar; });
    depenses.forEach((d) => { ensure(d.mois).charges += d.montant; });
    const monthly = Object.values(mset)
      .map((x) => ({ ...x, tva: x.caHT * tva, caTTC: x.caHT * (1 + tva), mb: x.caHT - x.coutVar, resultat: x.caHT - x.coutVar - x.charges }))
      .sort((a, b) => moisOrder(a.mois) - moisOrder(b.mois));
    const T = monthly.reduce((a, x) => ({ caHT: a.caHT + x.caHT, coutVar: a.coutVar + x.coutVar, charges: a.charges + x.charges, mb: a.mb + x.mb, resultat: a.resultat + x.resultat, tva: a.tva + x.tva, caTTC: a.caTTC + x.caTTC }), { caHT: 0, coutVar: 0, charges: 0, mb: 0, resultat: 0, tva: 0, caTTC: 0 });

    const depByCat = {};
    depenses.forEach((d) => (depByCat[d.categorie] = (depByCat[d.categorie] || 0) + d.montant));
    const catList = Object.entries(depByCat).map(([categorie, montant]) => ({ categorie, montant, color: CAT_COLORS[categorie] || "#4a5b58" })).sort((a, b) => b.montant - a.montant);

    const statutTotals = {};
    factures.forEach((f) => { if (f.annulee) return; statutTotals[f.statut] = (statutTotals[f.statut] || 0) + f.montantHT; });
    return { monthly, T, catList, statutTotals, totalCharges: T.charges + T.coutVar };
  }, [factures, depenses, tva]);

  const setFStatut = (id, statut) => setFactures((prev) => prev.map((f) => (f.id === id ? { ...f, statut } : f)));
  const delFact = (id) => setFactures((prev) => prev.filter((f) => f.id !== id));
  const delDep = (id) => setDepenses((prev) => prev.filter((d) => d.id !== id));

  return (
    <>
      <div className="section-title">
        <div className="pill-tab">
          {[["synthese", "Synthèse"], ["recettes", "Recettes"], ["creances", "Créances"], ["depenses", "Dépenses"], ["mensuel", "Vue mensuelle"]].map(([k, l]) => (
            <button key={k} className={sub === k ? "on" : ""} onClick={() => setSub(k)}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5 }} className="muted">
            <Settings2 size={14} /> TVA
            <select className="select" style={{ width: 92, padding: "6px 8px" }} value={tva} onChange={(e) => setTva(+e.target.value)}>
              <option value={0}>0 %</option><option value={0.055}>5,5 %</option><option value={0.1}>10 %</option><option value={0.2}>20 %</option>
            </select>
          </div>
          {sub !== "depenses" && <button className="btn btn-primary btn-sm" onClick={() => setShowFact(true)}><Plus size={15} /> Recette</button>}
          {sub === "depenses" && <button className="btn btn-primary btn-sm" onClick={() => setShowDep(true)}><Plus size={15} /> Dépense</button>}
        </div>
      </div>

      {sub === "synthese" && (
        <>
          <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <Kpi label="Chiffre d'affaires HT" value={fmtE(data.T.caHT)} sub={tva > 0 ? `${fmtE(data.T.caTTC)} TTC` : "TVA non applicable"} icon={Banknote} accent="#e02436" chipBg="#fdeaec" />
            <Kpi label="Charges totales" value={fmtE(data.totalCharges)} sub={`dont ${fmtE(data.T.coutVar)} variables`} icon={Wallet} accent="#e02436" chipBg="#fdeaec" />
            <Kpi label="Marge brute" value={fmtE(data.T.mb)} sub={`taux ${fmtPct1(data.T.mb / (data.T.caHT || 1))}`} icon={TrendingUp} accent="#ef7507" chipBg="#fdeede" />
            <Kpi label="Résultat net" value={fmtE(data.T.resultat)} sub={data.T.resultat >= 0 ? "exercice bénéficiaire" : "exercice déficitaire"} icon={CircleDollarSign} accent={data.T.resultat >= 0 ? "#029393" : "#e02436"} chipBg={data.T.resultat >= 0 ? "#e0f3f3" : "#fdeaec"} trend={data.T.resultat >= 0 ? "up" : "down"} />
          </div>
          <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr", marginTop: 16, alignItems: "start" }}>
            <div className="card card-pad">
              <div className="eyebrow">Flux mensuels</div>
              <h3 style={{ fontSize: 15, margin: "3px 0 12px" }}>CA, charges & résultat</h3>
              <div style={{ height: 270 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data.monthly} margin={{ top: 6, right: 6, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                    <XAxis dataKey="mois" tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(v) => `${v / 1000}k`} tickLine={false} axisLine={false} width={42} />
                    <Tooltip content={<ChartTip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="caHT" name="CA HT" fill="#e02436" radius={[5, 5, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="charges" name="Charges fixes" fill="#f7b9bd" radius={[5, 5, 0, 0]} maxBarSize={30} />
                    <Line dataKey="resultat" name="Résultat" stroke="#ef7507" strokeWidth={2.5} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card card-pad">
              <div className="eyebrow">Répartition</div>
              <h3 style={{ fontSize: 15, margin: "3px 0 8px" }}>Structure des dépenses</h3>
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.catList} dataKey="montant" nameKey="categorie" cx="50%" cy="50%" innerRadius={44} outerRadius={72} paddingAngle={2}>
                      {data.catList.map((c) => <Cell key={c.categorie} fill={c.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                {data.catList.map((c) => (
                  <div key={c.categorie} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                    <span className="dot" style={{ background: c.color }} />
                    <span>{c.categorie}</span>
                    <span className="num" style={{ marginLeft: "auto", fontWeight: 600 }}>{fmtE(c.montant)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {sub === "recettes" && (
        <>
          <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 16 }}>
            {Object.entries(FACT_STATUTS).map(([k, v]) => (
              <div className="card card-pad" key={k} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="ico-chip" style={{ background: v.bg }}>{k === "paye" ? <CheckCircle2 size={17} color={v.color} /> : k === "retard" ? <AlertTriangle size={17} color={v.color} /> : <Clock size={17} color={v.color} />}</div>
                <div><div className="faint" style={{ fontSize: 12 }}>{v.label}</div><div className="num" style={{ fontWeight: 700, fontSize: 17 }}>{fmtE(data.statutTotals[k] || 0)}</div></div>
              </div>
            ))}
          </div>
          <div className="card scroll-x">
            <table className="tbl">
              <thead><tr><th>Réf.</th><th>Client</th><th>Formation</th><th>Mois</th><th className="t-center">Part.</th><th className="t-right">CA HT</th><th className="t-right">Coût var.</th><th className="t-right">Marge</th><th>Statut</th><th></th></tr></thead>
              <tbody>
                {factures.filter((f) => !f.annulee).sort((a, b) => moisOrder(a.mois) - moisOrder(b.mois) || (a.date || "").localeCompare(b.date || "")).map((f) => {
                  const fo = formById(f.formationId), mb = f.montantHT - f.coutVar, st = FACT_STATUTS[f.statut] || FACT_STATUTS.attente;
                  return (
                    <tr key={f.id}>
                      <td className="faint" style={{ fontSize: 12 }}>{f.ref}</td>
                      <td style={{ fontWeight: 600 }}>{f.client}</td>
                      <td><span className="tag" style={{ color: fo?.color, borderColor: fo?.color + "44" }}>{fo?.code}</span></td>
                      <td className="faint">{f.mois}</td>
                      <td className="t-center num">{f.nbParticipants}</td>
                      <td className="t-right num" style={{ fontWeight: 700 }}>{fmtE(f.montantHT)}</td>
                      <td className="t-right num faint">{fmtE(f.coutVar)}</td>
                      <td className="t-right num" style={{ color: "var(--st-won)", fontWeight: 600 }}>{fmtE(mb)}</td>
                      <td>
                        <select className="select" style={{ width: 116, padding: "5px 8px", fontSize: 12, color: st.color, fontWeight: 600, borderColor: st.color + "44", background: st.bg }} value={f.statut} onChange={(e) => setFStatut(f.id, e.target.value)}>
                          {Object.entries(FACT_STATUTS).map(([k, v]) => <option key={k} value={k} style={{ color: "var(--ink)", background: "#fff" }}>{v.label}</option>)}
                        </select>
                      </td>
                      <td><button className="btn btn-icon" style={{ padding: 6 }} onClick={() => delFact(f.id)}><Trash2 size={13} /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {sub === "creances" && (() => {
        const rows = factures.filter((f) => !f.annulee && (f.statut === "attente" || f.statut === "retard"))
          .map((f) => { const c = computeSession(f); const age = Math.max(0, Math.round((TODAY_REF - new Date(f.date)) / 86400000)); return { f, c, age, ttc: c.ttc }; })
          .sort((a, b) => b.age - a.age);
        const buckets = [["0–30 j", 0, 30], ["31–60 j", 31, 60], ["61–90 j", 61, 90], ["+90 j", 91, 1e9]];
        const bk = buckets.map(([lab, lo, hi]) => ({ lab, total: rows.filter((r) => r.age >= lo && r.age <= hi).reduce((a, r) => a + r.ttc, 0), n: rows.filter((r) => r.age >= lo && r.age <= hi).length }));
        const totalDue = rows.reduce((a, r) => a + r.ttc, 0);
        const overdue = rows.filter((r) => r.f.statut === "retard" || r.age > 45).reduce((a, r) => a + r.ttc, 0);
        return (
          <>
            <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              <Kpi label="Encours total" value={fmtE(totalDue)} sub={`${rows.length} factures non encaissées`} icon={Wallet} accent="#e02436" chipBg="#fdeaec" />
              <Kpi label="Dont en retard" value={fmtE(overdue)} sub="retard déclaré ou > 45 j" icon={AlertTriangle} accent="#e02436" chipBg="#fdeaec" />
              {bk.slice(0, 2).map((b) => <Kpi key={b.lab} label={`Créances ${b.lab}`} value={fmtE(b.total)} sub={`${b.n} facture${b.n > 1 ? "s" : ""}`} icon={Clock} accent="#b5760a" chipBg="#fdf3df" />)}
            </div>
            <div className="card scroll-x" style={{ marginTop: 14 }}>
              <div className="card-pad" style={{ paddingBottom: 0 }}><div className="eyebrow">Balance âgée</div><h3 style={{ fontSize: 15, margin: "3px 0 4px" }}>Suivi des encaissements</h3><p className="faint" style={{ fontSize: 12, marginBottom: 8 }}>Sessions réalisées non réglées, classées par ancienneté. Marquez « Payé » à réception.</p></div>
              <table className="tbl">
                <thead><tr><th>Réf.</th><th>Client</th><th>Date session</th><th className="t-center">Ancienneté</th><th className="t-right">Montant TTC</th><th>Statut</th><th className="t-center">Action</th></tr></thead>
                <tbody>
                  {rows.map(({ f, age, ttc }) => {
                    const st = FACT_STATUTS[f.statut] || FACT_STATUTS.attente;
                    const danger = f.statut === "retard" || age > 60;
                    return (
                      <tr key={f.id}>
                        <td className="faint" style={{ fontSize: 12 }}>{f.ref}</td>
                        <td style={{ fontWeight: 600 }}>{f.client}</td>
                        <td className="num faint">{frDate(f.date)}</td>
                        <td className="t-center num" style={{ fontWeight: 700, color: danger ? "var(--st-lost)" : age > 30 ? "var(--gold)" : "var(--ink-2)" }}>{age} j</td>
                        <td className="t-right num" style={{ fontWeight: 700 }}>{fmtE(ttc)}</td>
                        <td><Badge color={st.color} bg={st.bg}>{st.label}</Badge></td>
                        <td className="t-center"><button className="btn btn-sm btn-primary" style={{ padding: "4px 10px" }} onClick={() => setFStatut(f.id, "paye")}>Marquer payé</button></td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && <tr><td colSpan={7} className="empty" style={{ padding: 22 }}>Aucune créance en cours — tout est encaissé. 🎉</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}

      {sub === "depenses" && (
        <div className="card scroll-x">
          <table className="tbl">
            <thead><tr><th>Libellé</th><th>Catégorie</th><th>Mois</th><th>Date</th><th className="t-center">Récurrent</th><th className="t-right">Montant</th><th></th></tr></thead>
            <tbody>
              {depenses.sort((a, b) => moisOrder(a.mois) - moisOrder(b.mois) || a.categorie.localeCompare(b.categorie)).map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>{d.libelle}{d.canal && <span className="tag" style={{ marginLeft: 7 }}>{d.canal}</span>}</td>
                  <td><Badge color={CAT_COLORS[d.categorie] || "#4a5b58"} bg={(CAT_COLORS[d.categorie] || "#4a5b58") + "1a"} dot>{d.categorie}</Badge></td>
                  <td className="faint">{d.mois}</td>
                  <td className="faint num">{frDate(d.date)}</td>
                  <td className="t-center faint">{d.recurrent ? "Oui" : "—"}</td>
                  <td className="t-right num" style={{ fontWeight: 700, color: "var(--st-lost)" }}>−{fmtE(d.montant)}</td>
                  <td><button className="btn btn-icon" style={{ padding: 6 }} onClick={() => delDep(d.id)}><Trash2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sub === "mensuel" && (
        <div className="card scroll-x">
          <table className="tbl">
            <thead><tr><th>Mois</th><th className="t-right">CA HT</th>{tva > 0 && <th className="t-right">TVA</th>}{tva > 0 && <th className="t-right">CA TTC</th>}<th className="t-right">Coût var.</th><th className="t-right">Marge brute</th><th className="t-right">Tx MB</th><th className="t-right">Charges fixes</th><th className="t-right">Résultat</th></tr></thead>
            <tbody>
              {data.monthly.map((x) => (
                <tr key={x.mois}>
                  <td style={{ fontWeight: 600 }}>{x.mois}</td>
                  <td className="t-right num">{fmtE(x.caHT)}</td>
                  {tva > 0 && <td className="t-right num faint">{fmtE(x.tva)}</td>}
                  {tva > 0 && <td className="t-right num">{fmtE(x.caTTC)}</td>}
                  <td className="t-right num faint">{fmtE(x.coutVar)}</td>
                  <td className="t-right num">{fmtE(x.mb)}</td>
                  <td className="t-right num faint">{x.caHT ? fmtPct(x.mb / x.caHT) : "—"}</td>
                  <td className="t-right num faint">{fmtE(x.charges)}</td>
                  <td className="t-right num" style={{ fontWeight: 700, color: x.resultat >= 0 ? "var(--st-won)" : "var(--st-lost)" }}>{x.resultat >= 0 ? "" : "−"}{fmtE(Math.abs(x.resultat))}</td>
                </tr>
              ))}
              <tr style={{ background: "var(--surface-2)", borderTop: "2px solid var(--line)" }}>
                <td style={{ fontWeight: 800 }}>TOTAL exercice</td>
                <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(data.T.caHT)}</td>
                {tva > 0 && <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(data.T.tva)}</td>}
                {tva > 0 && <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(data.T.caTTC)}</td>}
                <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(data.T.coutVar)}</td>
                <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(data.T.mb)}</td>
                <td className="t-right num" style={{ fontWeight: 800 }}>{fmtPct(data.T.mb / (data.T.caHT || 1))}</td>
                <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(data.T.charges)}</td>
                <td className="t-right num" style={{ fontWeight: 800, color: data.T.resultat >= 0 ? "var(--st-won)" : "var(--st-lost)" }}>{data.T.resultat >= 0 ? "" : "−"}{fmtE(Math.abs(data.T.resultat))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {showFact && <SessionModal session={null} onClose={() => setShowFact(false)} onSave={(s) => setFactures((p) => [...p, s])} />}
      {showDep && <NewDepenseModal onClose={() => setShowDep(false)} onCreate={(d) => setDepenses((p) => [...p, d])} />}
    </>
  );
}

/* ============================================================= *
 *  VUE — RENTABILITÉ (modèle & calculs calés sur le suivi 2026-2027)
 * ============================================================= */
const ORIGINES = ["LABOFORM", "CLIENT RECURENT", "INTER CDF", "LONASANTE", "ADWORDS", "PARTENAIRE", "DENTALL PROJECT", "Site web", "Recommandation", "Salon"];
const FINANCEMENTS = ["OPCO", "Entreprise", "Personnel / CPF", "France Travail", "Fonds publics", "Autre"];
const numOrNull = (v) => (v === "" || v == null || Number.isNaN(+v)) ? null : +v;
const sval = (v) => (v == null ? "" : String(v));

function SessionModal({ session, onClose, onSave, prefill }) {
  const isEdit = !!session;
  const [d, setD] = useState(session ? {
    ...session,
    nbCand: sval(session.nbCand), prixCand: sval(session.prixCand), forfait: sval(session.forfait),
    repas: sval(session.repas), cFormateur: sval(session.cFormateur), cesu: sval(session.cesu),
    locaux: sval(session.locaux), partenaire: sval(session.partenaire), placesMax: sval(session.placesMax),
    tva: sval(session.tva ?? 0),
    heures: sval(session.heures), presents: sval(session.presents), satisfaction: sval(session.satisfaction),
    attestations: sval(session.attestations), evalFaite: !!session.evalFaite, financement: session.financement || "Entreprise",
  } : {
    date: TODAY_ISO, formationId: "afgsu2", client: "", origine: "LABOFORM", formateur: "",
    base: "Groupe", nbCand: "", prixCand: "", forfait: "", repas: "", cFormateur: "", cesu: "",
    locaux: "", partenaire: "", tva: "0", statut: "paye", placesMax: "", annulee: false,
    heures: "", presents: "", satisfaction: "", attestations: "", evalFaite: false, financement: "Entreprise",
    ...(prefill || {}),
  });
  const set = (k, v) => setD((s) => ({ ...s, [k]: v }));

  const draft = {
    ...d, nbCand: numOrNull(d.nbCand), prixCand: numOrNull(d.prixCand), forfait: numOrNull(d.forfait),
    repas: numOrNull(d.repas), cFormateur: numOrNull(d.cFormateur), cesu: numOrNull(d.cesu),
    locaux: numOrNull(d.locaux), partenaire: numOrNull(d.partenaire), placesMax: numOrNull(d.placesMax),
    heures: numOrNull(d.heures), presents: numOrNull(d.presents),
    tva: +d.tva || 0,
  };
  const c = computeSession(draft);
  const estimer = () => {
    const f = formById(d.formationId); if (!f) return;
    set("cFormateur", String(Math.round(f.coutFormateurJour * f.dureeJours)));
    set("cesu", String(Math.round(f.coutSupportParticipant * (+d.nbCand || 0))));
    set("locaux", String(Math.round(f.coutSalleJour * f.dureeJours)));
  };
  const save = () => {
    if (!d.client.trim()) { alert("Le client est obligatoire."); return; }
    if (d.base === "Groupe" && draft.forfait == null) { alert("Renseignez le forfait groupe (CA HT)."); return; }
    if (d.base === "Par candidat" && (draft.prixCand == null || draft.nbCand == null)) { alert("Renseignez le prix par candidat et le nombre de candidats."); return; }
    // Sans coût, sans capacité et sans durée, la session n'est pas analysable :
    // elle afficherait 100 % de marge et un remplissage inconnu.
    const manque = [];
    const coutTotal = (draft.cFormateur || 0) + (draft.cesu || 0) + (draft.repas || 0)
                    + (draft.locaux || 0) + (draft.partenaire || 0);
    if (coutTotal <= 0) manque.push("au moins un coût direct (formateur, CESU, repas, locaux ou commission)");
    if (!(draft.placesMax > 0)) manque.push("la capacité de la session");
    if (!(draft.heures > 0)) manque.push("la durée en heures");
    if (manque.length && !session) {
      alert("Il manque " + manque.join(", ") + ".\n\n" +
        "Ces informations conditionnent le calcul de la marge, du taux de remplissage et de la marge horaire. " +
        "Une session enregistrée sans elles apparaît à 100 % de marge, ce qui fausse toutes vos analyses.");
      return;
    }
    onSave({
      id: session?.id || uid("s"), ref: session?.ref || `S-${(d.date || TODAY_ISO).replace(/-/g, "").slice(2)}`,
      date: d.date, formationId: d.formationId, client: d.client.trim(), origine: d.origine, formateur: (d.formateur || "").trim(),
      base: d.base, nbCand: draft.nbCand, prixCand: draft.prixCand, forfait: draft.forfait,
      repas: draft.repas, cFormateur: draft.cFormateur, cesu: draft.cesu, locaux: draft.locaux, partenaire: draft.partenaire,
      tva: draft.tva, statut: d.statut, placesMax: draft.placesMax, annulee: !!d.annulee,
      heures: numOrNull(d.heures), presents: numOrNull(d.presents), satisfaction: numOrNull(d.satisfaction),
      attestations: numOrNull(d.attestations), evalFaite: !!d.evalFaite, financement: d.financement || "Entreprise",
      mois: moisLabelFromDate(d.date), source: d.origine || "",
      montantHT: c.caht, coutVar: c.coutVar, nbParticipants: draft.nbCand || 0,
    });
    onClose();
  };
  const etatStyle = ETAT_STYLE[c.etat];

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><h3 style={{ fontSize: 17 }}>{isEdit ? "Modifier la session" : "Nouvelle session"}</h3><button className="btn btn-icon" onClick={onClose}><X size={16} /></button></div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="field"><label>Date</label><input className="input" type="date" value={d.date} onChange={(e) => set("date", e.target.value)} /></div>
            <div className="field"><label>Formation</label><select className="select" value={d.formationId} onChange={(e) => set("formationId", e.target.value)}>{FORMATIONS.map((f) => <option key={f.id} value={f.id}>{f.code} — {f.nom}</option>)}</select></div>
            <div className="field field-c2"><label>Client</label><input className="input" autoFocus value={d.client} onChange={(e) => set("client", e.target.value)} placeholder="Nom du client" /></div>
            <div className="field"><label>Origine du lead</label><select className="select" value={d.origine} onChange={(e) => set("origine", e.target.value)}>{ORIGINES.map((o) => <option key={o}>{o}</option>)}</select></div>
            <div className="field"><label>Formateur</label><input className="input" list="dl_formateurs" value={d.formateur} onChange={(e) => set("formateur", e.target.value)} placeholder="Nom" /><datalist id="dl_formateurs">{FORMATEURS.map((f) => <option key={f} value={f} />)}</datalist></div>
            <div className="field"><label>Base de facturation</label><select className="select" value={d.base} onChange={(e) => set("base", e.target.value)}><option>Groupe</option><option>Par candidat</option></select></div>
            <div className="field"><label>Nb candidats</label><input className="input num" type="number" min="0" value={d.nbCand} onChange={(e) => set("nbCand", e.target.value)} placeholder="—" /></div>
            {d.base === "Groupe"
              ? <div className="field"><label>Forfait groupe (€)</label><input className="input num" type="number" value={d.forfait} onChange={(e) => set("forfait", e.target.value)} /></div>
              : <div className="field"><label>Prix / candidat (€)</label><input className="input num" type="number" value={d.prixCand} onChange={(e) => set("prixCand", e.target.value)} /></div>}
            <div className="field"><label>CA HT (€) · auto</label><input className="input num" readOnly value={fmtE(c.caht)} style={{ background: "var(--surface-2)", fontWeight: 700 }} /></div>
            <div className="field"><label>Places max</label><input className="input num" type="number" min="1" value={d.placesMax} onChange={(e) => set("placesMax", e.target.value)} placeholder="12" /></div>
            <div className="field"><label>Apprenants présents</label><input className="input num" type="number" min="0" value={d.presents} onChange={(e) => set("presents", e.target.value)} placeholder="10" /></div>
            <div className="field"><label>Durée (heures)</label><input className="input num" type="number" min="0" step="0.5" value={d.heures} onChange={(e) => set("heures", e.target.value)} placeholder="14" /></div>
            <div className="field"><label>TVA %</label><input className="input num" type="number" min="0" value={d.tva} onChange={(e) => set("tva", e.target.value)} /></div>
            <div className="field field-c2" style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="button" className="btn btn-sm" onClick={estimer}><Calculator size={13} /> Estimer les coûts directs (catalogue)</button>
            </div>
            <div className="field"><label>Coût formateur (€)</label><input className="input num" type="number" value={d.cFormateur} onChange={(e) => set("cFormateur", e.target.value)} /></div>
            <div className="field"><label>Coût repas (€)</label><input className="input num" type="number" value={d.repas} onChange={(e) => set("repas", e.target.value)} /></div>
            <div className="field"><label>Coût CESU (€)</label><input className="input num" type="number" value={d.cesu} onChange={(e) => set("cesu", e.target.value)} /></div>
            <div className="field"><label>Location locaux (€)</label><input className="input num" type="number" value={d.locaux} onChange={(e) => set("locaux", e.target.value)} /></div>
            <div className="field"><label>Coût partenaire (€)</label><input className="input num" type="number" value={d.partenaire} onChange={(e) => set("partenaire", e.target.value)} /></div>
            <div className="field"><label>Statut paiement</label><select className="select" value={d.statut} onChange={(e) => set("statut", e.target.value)}>{Object.entries(FACT_STATUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
            <div className="field" style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <input id="f_annulee" type="checkbox" checked={!!d.annulee} onChange={(e) => set("annulee", e.target.checked)} style={{ width: 16, height: 16 }} />
              <label htmlFor="f_annulee" style={{ margin: 0 }}>Session annulée</label>
            </div>
          </div>
          <div className="card" style={{ marginTop: 14, padding: "11px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-2)", gap: 12, flexWrap: "wrap" }}>
            <Badge color={etatStyle.color} bg={etatStyle.bg} dot>{c.etat}</Badge>
            <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
              <span className="faint" style={{ fontSize: 12.5 }}>Coûts directs <b className="num" style={{ color: "var(--ink)" }}>{fmtE(c.coutVar)}</b></span>
              <span className="faint" style={{ fontSize: 12.5 }}>Marge brute <b className="num" style={{ color: c.mb >= 0 ? "var(--st-won)" : "var(--st-lost)" }}>{fmtE(c.mb)}</b> {c.tx != null && <span className="num" style={{ fontWeight: 700 }}>({fmtPct1(c.tx)})</span>}</span>
            </div>
          </div>
        </div>
        <div className="modal-foot"><button className="btn" onClick={onClose}>Annuler</button><button className="btn btn-primary" onClick={save}><CheckCircle2 size={15} /> {isEdit ? "Enregistrer" : "Ajouter la session"}</button></div>
      </div>
    </div>
  );
}

function ParamsModal({ params, onClose, onSave }) {
  const [p, setP] = useState({ ...params });
  const set = (k, v) => setP((s) => ({ ...s, [k]: v }));
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><h3 style={{ fontSize: 17 }}>Paramètres de pilotage</h3><button className="btn btn-icon" onClick={onClose}><X size={16} /></button></div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="field"><label>Objectif CA mensuel (€)</label><input className="input num" type="number" value={p.objectif} onChange={(e) => set("objectif", +e.target.value || 0)} /></div>
            <div className="field"><label>Objectif CA annuel (€)</label><input className="input num" type="number" value={p.objectifAnnuel} onChange={(e) => set("objectifAnnuel", +e.target.value || 0)} /></div>
            <div className="field"><label>Charges fixes / mois (€)</label><input className="input num" type="number" value={p.charges} onChange={(e) => set("charges", +e.target.value || 0)} /></div>
            <div className="field"><label>Marketing / mois (€)</label><input className="input num" type="number" value={p.marketing} onChange={(e) => set("marketing", +e.target.value || 0)} /></div>
            <div className="field"><label>Capacité par défaut (places)</label><input className="input num" type="number" value={p.capacite} onChange={(e) => set("capacite", +e.target.value || 0)} /></div>
          </div>
          <div className="note" style={{ marginTop: 14 }}>
            La <b>marge nette</b> = marge brute réalisée − (charges fixes + marketing) × nombre de mois actifs. Le <b>point mort mensuel</b> = (charges fixes + marketing) ÷ taux de marge brute moyen.
          </div>
        </div>
        <div className="modal-foot"><button className="btn" onClick={onClose}>Annuler</button><button className="btn btn-primary" onClick={() => { onSave(p); onClose(); }}><CheckCircle2 size={15} /> Enregistrer</button></div>
      </div>
    </div>
  );
}

function Rentabilite({ factures, setFactures, prospects, depenses, params, setParams }) {
  const P = params || DEFAULT_PARAMS;
  const [sub, setSub] = useState("dash");
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showParams, setShowParams] = useState(false);
  const [q, setQ] = useState("");
  const [fMois, setFMois] = useState("");
  const [fEtat, setFEtat] = useState("");
  const [openMonths, setOpenMonths] = useState({});
  const [openRow, setOpenRow] = useState(null);
  const toggleMonth = (m) => setOpenMonths((o) => ({ ...o, [m]: !o[m] }));
  const sessionsOfMonth = (label) => factures
    .filter((s) => moisLabelFromDate(s.date) === label)
    .map((s) => ({ s, c: computeSession(s, P) }))
    .sort((a, b) => (a.s.date || "").localeCompare(b.s.date || ""));

  const delSession = (id) => { if (confirm("Supprimer cette session ? Elle disparaîtra aussi des recettes.")) setFactures((prev) => prev.filter((f) => f.id !== id)); };
  const saveSession = (s) => setFactures((prev) => (prev.some((f) => f.id === s.id) ? prev.map((f) => (f.id === s.id ? s : f)) : [...prev, s]));
  const patchSession = (id, patch) => setFactures((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const clientOptions = useMemo(() => [...new Set(factures.map((f) => (f.client || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr")), [factures]);
  const origineOptions = useMemo(() => [...new Set([...ORIGINES, ...factures.map((f) => (f.origine || "").trim()).filter(Boolean)])].sort((a, b) => a.localeCompare(b, "fr")), [factures]);

  const agg = useMemo(() => {
    let caR = 0, mbR = 0, nbT = 0, ttcR = 0, rateSum = 0, rateN = 0, caConf = 0, mbConf = 0, nbConf = 0, caPlan = 0, annulN = 0, annulCA = 0, paid = 0, paidBase = 0;
    const months = new Set();
    for (const s of factures) {
      const c = computeSession(s, P);
      if (c.etat === "Annulée") { annulN++; annulCA += c.caht; continue; }
      if (c.etat === "Réalisée") {
        caR += c.caht; mbR += c.mb; nbT++; ttcR += c.ttc; months.add(moisLabelFromDate(s.date));
        if (c.rempl != null) { rateSum += c.rempl; rateN++; }
        paidBase += c.ttc; if (s.statut === "paye") paid += c.ttc;
      } else if (c.etat === "À venir") { caConf += c.caht; mbConf += c.mb; nbConf++; }
      else caPlan += c.caht;
    }
    const txMB = caR > 0 ? mbR / caR : 0;
    const am = months.size;
    const fixed = (P.charges || 0) + (P.marketing || 0);
    const margeNette = mbR - fixed * am;
    const pointMort = txMB > 0 ? fixed / txMB : 0;
    const caMoisMoyen = am ? caR / am : 0;
    const caSessMoyen = nbT ? caR / nbT : 0;
    const remplMoyen = rateN ? rateSum / rateN : null;
    const pctPaye = paidBase > 0 ? paid / paidBase : 0;
    const open = (prospects || []).filter((p) => !["gagne", "perdu", "npertinent"].includes(p.stage));
    const caPondere = open.reduce((a, p) => a + (p.montant || 0) * (p.proba || 0) / 100, 0);
    const caPipeline = open.reduce((a, p) => a + (p.montant || 0), 0);
    const atterrissage = caR + caConf;
    const objAnnuel = P.objectifAnnuel || 0;
    const moisRestants = Math.max(0, 12 - am);
    const manquantAnnuel = Math.max(0, objAnnuel - atterrissage);
    const manquantParMois = moisRestants > 0 ? manquantAnnuel / moisRestants : 0;
    const sessionsParMois = (manquantParMois > 0 && caSessMoyen > 0) ? Math.ceil(manquantParMois / caSessMoyen) : 0;
    const rythme = caMoisMoyen > 0 ? manquantParMois / caMoisMoyen : null;
    return { caR, mbR, txMB, nbT, am, fixed, margeNette, pointMort, caMoisMoyen, caSessMoyen, remplMoyen, pctPaye, caConf, mbConf, nbConf, caPlan, annulN, annulCA, caPondere, caPipeline, atterrissage, objAnnuel, moisRestants, manquantAnnuel, manquantParMois, sessionsParMois, rythme, ttcR };
  }, [factures, P, prospects]);

  const monthly = useMemo(() => {
    const map = {};
    MOIS.forEach((m) => (map[m] = { mois: m, nbT: 0, caR: 0, mb: 0, coutVar: 0, caPlan: 0, caConf: 0, nbConf: 0 }));
    for (const s of factures) {
      const c = computeSession(s, P); const k = moisLabelFromDate(s.date);
      if (!map[k]) map[k] = { mois: k, nbT: 0, caR: 0, mb: 0, coutVar: 0, caPlan: 0, caConf: 0, nbConf: 0, extra: true };
      if (c.etat === "Réalisée") { map[k].caR += c.caht; map[k].mb += c.mb; map[k].coutVar += c.coutVar; map[k].nbT++; }
      else if (c.etat === "À venir") { map[k].caConf += c.caht; map[k].nbConf++; }
      else if (c.etat === "Planifiée") map[k].caPlan += c.caht;
    }
    return MOIS.map((m) => map[m]).concat(Object.values(map).filter((x) => x.extra));
  }, [factures, P]);

  const quality = useMemo(() => {
    let noCost = 0, noCand = 0, lowMargin = 0, unpaid = 0, caTotal = 0, noCostCA = 0;
    for (const s of factures) {
      const c = computeSession(s, P); if (c.etat !== "Réalisée") continue;
      caTotal += c.caht;
      if (c.coutVar === 0) { noCost++; noCostCA += c.caht; }
      if (s.nbCand === "" || s.nbCand == null) noCand++;
      if (c.tx != null && c.tx < 0.4) lowMargin++;
      if (s.statut !== "paye" && s.statut !== "so") unpaid++;
    }
    return { noCost, noCand, lowMargin, unpaid, share: caTotal > 0 ? Math.round(noCostCA / caTotal * 100) : 0 };
  }, [factures, P]);

  const parFormation = useMemo(() => {
    const rows = FORMATIONS.map((f) => {
      let ca = 0, cout = 0, mb = 0, nb = 0, part = 0, seats = 0;
      for (const s of factures) {
        if (s.formationId !== f.id) continue;
        const c = computeSession(s, P); if (c.etat === "Annulée" || c.etat === "Planifiée") continue;
        ca += c.caht; cout += c.coutVar; mb += c.mb; nb++;
        if (c.rempl != null) { part += nval(s.nbCand); seats += c.eff; }
      }
      return { ...f, ca, cout, mb, nb, part, taux: ca ? mb / ca : 0, rempl: seats ? part / seats : 0 };
    }).filter((x) => x.nb > 0).sort((a, b) => b.mb - a.mb);
    const totalCA = rows.reduce((a, x) => a + x.ca, 0);
    return { rows, totalCA };
  }, [factures, P]);

  const parFormateur = useMemo(() => {
    const map = {};
    for (const s of factures) {
      const c = computeSession(s, P); if (c.etat === "Annulée" || c.etat === "Planifiée") continue;
      const name = (s.formateur || "").trim() || "— non renseigné —";
      const m = map[name] || (map[name] = { name, ca: 0, cout: 0, mb: 0, nb: 0, heures: 0 });
      m.ca += c.caht; m.cout += c.coutVar; m.mb += c.mb; m.nb++; m.heures += (c.heures || 0);
    }
    return Object.values(map).map((x) => ({ ...x, taux: x.ca ? x.mb / x.ca : 0, coutMoyen: x.nb ? x.cout / x.nb : 0 })).sort((a, b) => b.ca - a.ca);
  }, [factures, P]);

  const parClient = useMemo(() => {
    const map = {};
    for (const s of factures) {
      const c = computeSession(s, P); if (c.etat === "Annulée" || c.etat === "Planifiée") continue;
      const name = (s.client || "").trim() || "— non renseigné —";
      const m = map[name] || (map[name] = { name, ca: 0, caReel: 0, mb: 0, nb: 0, last: "", prov: {} });
      m.ca += c.caht; if (c.etat === "Réalisée") m.caReel += c.caht; m.mb += c.mb; m.nb++;
      if (s.date > m.last) m.last = s.date;
      const pv = (s.origine || s.source || "").trim(); if (pv) m.prov[pv] = (m.prov[pv] || 0) + 1;
    }
    const rows = Object.values(map).map((x) => {
      const provList = Object.entries(x.prov).sort((a, b) => b[1] - a[1]).map(([k]) => k);
      return { ...x, taux: x.ca ? x.mb / x.ca : 0, provList, provMain: provList[0] || "—" };
    }).sort((a, b) => b.ca - a.ca);
    const total = rows.reduce((a, x) => a + x.ca, 0);
    return { rows, total };
  }, [factures, P]);

  const tableData = useMemo(() => {
    let list = factures.map((s) => ({ s, c: computeSession(s, P) }));
    const term = q.toLowerCase().trim();
    if (term) list = list.filter(({ s }) => [s.client, s.formateur, formById(s.formationId)?.code, s.origine].join(" ").toLowerCase().includes(term));
    if (fMois) list = list.filter(({ s }) => moisLabelFromDate(s.date) === fMois);
    if (fEtat) list = list.filter(({ c }) => c.etat === fEtat);
    return list.sort((a, b) => (b.s.date || "").localeCompare(a.s.date || ""));
  }, [factures, P, q, fMois, fEtat]);

  const chartData = monthly.filter((m) => MOIS.includes(m.mois)).map((m) => ({ ...m, objectif: objectifMois(m.mois, P), n1: n1Ca(m.mois, P), pm: agg.pointMort }));
  const pieData = parFormation.rows.map((x) => ({ name: x.code, value: x.ca, color: x.color }));

  return (
    <>
      <div className="section-title">
        <div className="pill-tab">
          {[["dash", "Tableau de bord"], ["sessions", "Sessions"], ["monthly", "Suivi mensuel"], ["formation", "Par formation"], ["formateur", "Par formateur"], ["client", "Par client"]].map(([k, l]) => (
            <button key={k} className={sub === k ? "on" : ""} onClick={() => setSub(k)}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-sm" onClick={() => setShowParams(true)}><Settings2 size={15} /> Paramètres</button>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setShowNew(true); }}><Plus size={15} /> Nouvelle session</button>
        </div>
      </div>

      {sub === "dash" && (
        <>
          <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <Kpi label="CA réalisé" value={fmtE(agg.caR)} sub={`${agg.nbT} sessions passées · ${agg.am} mois`} icon={Banknote} accent="#e02436" chipBg="#fdeaec" />
            <Kpi label="CA confirmé à venir" value={fmtE(agg.caConf)} sub={`${agg.nbConf} sessions signées non tenues`} icon={CalendarRange} accent="#00b4bc" chipBg="#e3f6f7" />
            <Kpi label="Atterrissage prévu" value={fmtE(agg.atterrissage)} sub="réalisé + confirmé" icon={Target} accent="#029393" chipBg="#e0f3f3" />
            <Kpi label="Pipeline pondéré" value={fmtE(agg.caPondere)} sub={`sur ${fmtE(agg.caPipeline)} en cours (CRM)`} icon={TrendingUp} accent="#ef7507" chipBg="#fdeede" />
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginTop: 12 }}>
            <Kpi label="Marge brute réalisée" value={fmtE(agg.mbR)} sub={`taux moyen ${fmtPct1(agg.txMB)}`} icon={Percent} accent="#7a5af8" chipBg="#fdeede" />
            <Kpi label="Marge nette" value={fmtE(agg.margeNette)} sub="après charges fixes + marketing" icon={CircleDollarSign} accent={agg.margeNette >= 0 ? "#029393" : "#e02436"} chipBg={agg.margeNette >= 0 ? "#e0f3f3" : "#fdeaec"} trend={agg.margeNette >= 0 ? "up" : "down"} />
            <Kpi label="Point mort / mois" value={fmtE(agg.pointMort)} sub="CA mensuel d'équilibre" icon={Target} accent="#b5760a" chipBg="#fdf3df" />
            <Kpi label="% encaissé" value={agg.ttcR > 0 ? fmtPct1(agg.pctPaye) : "—"} sub="sessions réalisées, TTC" icon={CheckCircle2} accent="#029393" chipBg="#e0f3f3" />
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginTop: 12 }}>
            <Kpi label="CA réalisé / mois" value={fmtE(agg.caMoisMoyen)} sub="moyenne sur mois actifs" icon={CalendarDays} accent="#00b4bc" chipBg="#e3f6f7" />
            <Kpi label="CA moyen / session" value={fmtE(agg.caSessMoyen)} sub={`${agg.nbT} sessions réalisées`} icon={Layers} accent="#029393" chipBg="#e0f3f3" />
            <Kpi label="Taux de remplissage" value={agg.remplMoyen != null ? fmtPct1(agg.remplMoyen) : "—"} sub="sur sessions renseignées" icon={Users} accent="#ef7507" chipBg="#fdeede" />
          </div>

          <div className="card card-pad" style={{ marginTop: 16 }}>
            <div className="eyebrow">Performance mensuelle</div>
            <h3 style={{ fontSize: 15, margin: "3px 0 12px" }}>CA réalisé & confirmé vs objectif, point mort et N‑1</h3>
            <div style={{ height: 290 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 6, right: 8, left: -6, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                  <XAxis dataKey="mois" tickLine={false} axisLine={false} fontSize={11.5} />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tickLine={false} axisLine={false} width={42} />
                  <Tooltip content={<ChartTip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="caR" name="CA réalisé" stackId="ca" radius={[0, 0, 0, 0]} maxBarSize={32}>
                    {chartData.map((m, i) => <Cell key={i} fill={m.caR > 0 && m.caR >= agg.pointMort ? "#029393" : m.caR > 0 ? "#e0a800" : "#029393"} />)}
                  </Bar>
                  <Bar dataKey="caConf" name="CA confirmé à venir" stackId="ca" fill="#9bd9dd" radius={[5, 5, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="caPlan" name="Pipeline planifié" fill="#e3ecea" radius={[5, 5, 0, 0]} maxBarSize={32} />
                  <Line dataKey="objectif" name="Objectif (saison.)" stroke="#e0a800" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                  <Line dataKey="pm" name="Point mort" stroke="#e02436" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                  <Line dataKey="n1" name="N‑1" stroke="#8a9b9a" strokeWidth={1.8} dot={{ r: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h3 className="sec-h" style={{ fontSize: 14, margin: "20px 0 10px", color: "var(--ink-2)" }}>Objectif annuel — combien viser chaque mois</h3>
          <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <Kpi label="Objectif annuel" value={fmtE(agg.objAnnuel)} sub={`${agg.objAnnuel ? fmtPct(agg.atterrissage / agg.objAnnuel) : "—"} sécurisé (réalisé+confirmé) · reste ${fmtE(agg.manquantAnnuel)}`} icon={Target} accent="#e02436" chipBg="#fdeaec" />
            <Kpi label="CA manquant / mois" value={agg.manquantParMois <= 0 ? "Atteint ✓" : fmtE(agg.manquantParMois)} sub={agg.manquantParMois <= 0 ? "objectif sécurisé" : `sur ${agg.moisRestants} mois restants`} icon={CircleDollarSign} accent={agg.manquantParMois <= 0 ? "#029393" : "#e02436"} chipBg={agg.manquantParMois <= 0 ? "#e0f3f3" : "#fdeaec"} />
            <Kpi label="Sessions à ajouter / mois" value={agg.sessionsParMois || (agg.manquantParMois <= 0 ? "0" : "—")} sub={`à ${fmtE(agg.caSessMoyen)} / session`} icon={Layers} accent="#ef7507" chipBg="#fdeede" />
            <Kpi label="Rythme requis vs actuel" value={agg.rythme != null ? `${agg.rythme.toFixed(1)} ×` : "—"} sub="CA/mois à faire vs réalisé" icon={TrendingUp} accent="#b5760a" chipBg="#fdf3df" />
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-pad" style={{ paddingBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div className="eyebrow">Qualité des données</div><h3 style={{ fontSize: 15, marginTop: 3 }}>À corriger</h3></div>
            </div>
            {quality.share > 0 && (
              <div style={{ margin: "0 16px 12px", padding: "10px 13px", borderRadius: 10, background: "var(--gold-50)", color: "#9a5b00", fontSize: 12.5, display: "flex", gap: 8 }}>
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} /> <span><b>Fiabilité : {quality.share}% du CA réalisé n'a aucun coût saisi.</b> La marge brute affichée est donc surestimée — complétez les coûts des sessions concernées.</span>
              </div>
            )}
            <div style={{ padding: "0 16px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
              {[["Sessions réalisées sans coût direct", quality.noCost, "Saisir les coûts (sinon marge surestimée)"],
                ["Sessions réalisées sans nb candidats", quality.noCand, "Renseigner le nombre de candidats"],
                ["Sessions réalisées à marge < 40 %", quality.lowMargin, "Analyser le coût formateur"],
                ["Sessions réalisées non encaissées", quality.unpaid, "Relancer le recouvrement"]].map(([lab, cnt, act]) => (
                <div key={lab} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", border: "1px solid var(--line-2)", borderRadius: 10 }}>
                  <span className="num" style={{ fontWeight: 800, fontSize: 18, width: 34, textAlign: "center", color: cnt > 0 ? "var(--st-lost)" : "var(--st-won)" }}>{cnt}</span>
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{lab}</div><div className="faint" style={{ fontSize: 11.5 }}>{act}</div></div>
                  <Badge color={cnt > 0 ? "var(--st-lost)" : "var(--st-won)"} bg={cnt > 0 ? "var(--st-lost-bg)" : "var(--st-won-bg)"}>{cnt > 0 ? "À corriger" : "OK"}</Badge>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {sub === "sessions" && (
        <>
          <div className="section-title" style={{ marginTop: 4 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <Search size={15} color="var(--ink-3)" style={{ position: "absolute", left: 11, top: 10 }} />
                <input className="input" style={{ paddingLeft: 32, width: 230 }} placeholder="Client, formateur, formation…" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <select className="select" style={{ width: 150 }} value={fMois} onChange={(e) => setFMois(e.target.value)}><option value="">Tous les mois</option>{MOIS.map((m) => <option key={m}>{m}</option>)}</select>
              <select className="select" style={{ width: 140 }} value={fEtat} onChange={(e) => setFEtat(e.target.value)}><option value="">Tous états</option><option>Réalisée</option><option>À venir</option><option>Planifiée</option><option>Annulée</option></select>
              <span className="faint" style={{ fontSize: 12.5 }}>{tableData.length} session{tableData.length > 1 ? "s" : ""}</span>
            </div>
          </div>
          <div className="card scroll-x">
            <datalist id="dl_clients_sessions">{clientOptions.map((c) => <option key={c} value={c} />)}</datalist>
            <datalist id="dl_origines_sessions">{origineOptions.map((c) => <option key={c} value={c} />)}</datalist>
            <table className="tbl">
              <thead><tr>
                <th style={{ width: 26 }}></th>
                <th>Date</th><th>Formation</th><th style={{ minWidth: 168 }}>Client</th><th>Formateur</th>
                <th className="t-center">Appr. / cap.</th><th className="t-right">Durée</th>
                <th className="t-right">CA HT</th><th className="t-right">Coût direct</th>
                <th className="t-right">Marge</th><th className="t-right">Taux</th>
                <th className="t-right">€/appr.</th><th className="t-right">€/h</th>
                <th>État</th><th className="t-center">Actions</th>
              </tr></thead>
              <tbody>
                {tableData.map(({ s, c }) => {
                  const fo = formById(s.formationId), st = FACT_STATUTS[s.statut] || FACT_STATUTS.attente, es = ETAT_STYLE[c.etat];
                  return (
                    <Fragment key={s.id}>
                    <tr>
                      <td>
                        <button className="btn btn-icon" style={{ padding: 4 }} title="Détail des coûts"
                          onClick={() => setOpenRow(openRow === s.id ? null : s.id)}>
                          <ChevronRight size={13} style={{ transform: openRow === s.id ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
                        </button>
                      </td>
                      <td className="num faint" style={{ whiteSpace: "nowrap" }}>{frDate(s.date)}</td>
                      <td><span className="tag" style={{ color: fo?.color, borderColor: fo?.color + "44" }}>{fo?.code || "—"}</span></td>
                      <td>
                        <input className="input cell-input" list="dl_clients_sessions" value={s.client || ""} placeholder="Nom du client…"
                          onChange={(e) => patchSession(s.id, { client: e.target.value })}
                          style={{ width: "100%", minWidth: 150, padding: "5px 8px", fontSize: 12.5, fontWeight: 600 }} />
                      </td>
                      <td className="faint" style={{ fontSize: 12 }}>{s.formateur || <span style={{ color: "var(--gold)" }}>à affecter</span>}</td>
                      <td className="t-center num" style={{ whiteSpace: "nowrap" }}>
                        {c.presents || "—"}<span className="faint"> / {c.capaciteSaisie ? c.eff : "?"}</span>
                        {c.rempl != null && (
                          <div className="faint" style={{ fontSize: 10.5, color: c.rempl < 0.7 ? "var(--gold)" : "var(--ink-3)" }}>
                            {fmtPct(c.rempl)}
                          </div>
                        )}
                      </td>
                      <td className="t-right num faint">{c.heuresSaisies ? `${c.heures} h` : "—"}</td>
                      <td className="t-right num" style={{ fontWeight: 700 }}>{c.caht ? fmtE(c.caht) : "—"}</td>
                      <td className="t-right num faint">{c.coutSaisi ? fmtE(c.coutVar) : <span style={{ color: "var(--gold)" }}>à saisir</span>}</td>
                      <td className="t-right num" style={{ color: !c.coutSaisi ? "var(--ink-3)" : c.tx < 0.4 ? "var(--st-lost)" : "var(--brand)", fontWeight: 600 }}>
                        {c.caht && c.coutSaisi ? fmtE(c.mb) : "—"}</td>
                      <td className="t-right num faint">{c.coutSaisi && c.tx != null ? fmtPct(c.tx) : "—"}</td>
                      <td className="t-right num faint">{c.margeAppr != null ? fmtE(c.margeAppr) : "—"}</td>
                      <td className="t-right num faint">{c.margeHoraire != null ? fmtE(c.margeHoraire) : "—"}</td>
                      <td><Badge color={es.color} bg={es.bg} dot>{c.etat}</Badge></td>
                      <td>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button className="btn btn-icon" style={{ padding: 6 }} title="Modifier" onClick={() => { setEditing(s); setShowNew(false); }}><Pencil size={13} /></button>
                          <button className="btn btn-icon" style={{ padding: 6 }} title="Supprimer" onClick={() => delSession(s.id)}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                    {openRow === s.id && (
                      <tr>
                        <td colSpan={15} style={{ background: "var(--surface-2)", padding: "14px 18px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 18 }}>
                            <div>
                              <div className="eyebrow" style={{ marginBottom: 7 }}>Compte de résultat de la session</div>
                              {[["Chiffre d'affaires HT", c.caht, true],
                                ["Formateur (facture)", -(nval(s.cFormateur)), false],
                                ["Formateur (CESU)", -(nval(s.cesu)), false],
                                ["Repas", -(nval(s.repas)), false],
                                ["Locaux", -(nval(s.locaux)), false],
                                ["Commission partenaire", -(nval(s.partenaire)), false]].map(([lib, v, gras]) => (
                                <div key={lib} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "2px 0",
                                  color: v === 0 ? "var(--ink-3)" : "var(--ink-2)" }}>
                                  <span>{lib}</span><span className="num" style={{ fontWeight: gras ? 700 : 500 }}>{v ? fmtE(v) : "—"}</span>
                                </div>
                              ))}
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, paddingTop: 6, marginTop: 5,
                                borderTop: "1px solid var(--line)", fontWeight: 700 }}>
                                <span>Marge sur coûts directs</span>
                                <span className="num" style={{ color: c.coutSaisi ? "var(--brand)" : "var(--gold)" }}>
                                  {c.coutSaisi ? `${fmtE(c.mb)} · ${fmtPct(c.tx)}` : "coûts non saisis"}</span>
                              </div>
                            </div>
                            <div>
                              <div className="eyebrow" style={{ marginBottom: 7 }}>Leviers</div>
                              {[["Part du formateur dans le CA", c.partFormateur != null && c.coutSaisi ? fmtPct(c.partFormateur) : "—"],
                                ["Taux de remplissage", c.rempl != null ? fmtPct(c.rempl) : "capacité non saisie"],
                                ["Places vides", c.capaciteSaisie && c.presents ? `${Math.max(0, c.eff - c.presents)}` : "—"],
                                ["Marge par apprenant", c.margeAppr != null ? fmtE(c.margeAppr) : "—"],
                                ["Marge horaire", c.margeHoraire != null ? fmtE(c.margeHoraire) : "durée non saisie"],
                                ["CA par apprenant", c.presents ? fmtE(c.caht / c.presents) : "—"]].map(([lib, v]) => (
                                <div key={lib} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "2px 0" }}>
                                  <span style={{ color: "var(--ink-2)" }}>{lib}</span>
                                  <span className="num" style={{ fontWeight: 600 }}>{v}</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div className="eyebrow" style={{ marginBottom: 7 }}>Contexte</div>
                              <div className="field" style={{ marginBottom: 8 }}>
                                <label style={{ fontSize: 11 }}>Provenance du lead</label>
                                <input className="input" list="dl_origines_sessions" value={s.origine || ""} placeholder="Provenance…"
                                  onChange={(e) => patchSession(s.id, { origine: e.target.value, source: e.target.value })}
                                  style={{ padding: "5px 8px", fontSize: 12 }} />
                              </div>
                              {[["Financement", s.financement || "—"],
                                ["Base de facturation", s.base || "—"],
                                ["Paiement", st.label]].map(([lib, v]) => (
                                <div key={lib} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "2px 0" }}>
                                  <span style={{ color: "var(--ink-2)" }}>{lib}</span><span style={{ fontWeight: 600 }}>{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                  );
                })}
                {tableData.length === 0 && <tr><td colSpan={14} className="empty" style={{ padding: 26 }}>Aucune session. Ajoutez-en une avec « Nouvelle session ».</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {sub === "monthly" && (
        <div className="card scroll-x">
          <div className="card-pad" style={{ paddingBottom: 0 }}><div className="eyebrow">Suivi mensuel</div><h3 style={{ fontSize: 15, margin: "3px 0 10px" }}>Rentabilité mois par mois</h3></div>
          <table className="tbl">
            <thead><tr><th>Mois</th><th className="t-center">Sess.</th><th className="t-right">CA réalisé</th><th className="t-right">À venir</th><th className="t-right">Marge brute</th><th className="t-right">Tx MB</th><th className="t-right">Marge nette</th><th className="t-right">Point mort</th><th className="t-right">Obj. mois</th><th className="t-right">Écart obj.</th><th className="t-right">N‑1</th><th className="t-center">Rentable ?</th></tr></thead>
            <tbody>
              {monthly.map((d) => {
                const active = d.nbT > 0;
                const txMB = d.caR > 0 ? d.mb / d.caR : null;
                const nette = active ? d.mb - agg.fixed : null;
                const pm = agg.txMB > 0 ? agg.fixed / agg.txMB : 0;
                const objM = objectifMois(d.mois, P);
                const ecart = d.caR - objM;
                const n1 = n1Ca(d.mois, P);
                const list = sessionsOfMonth(d.mois);
                const canOpen = list.length > 0;
                const open = !!openMonths[d.mois];
                return (
                  <Fragment key={d.mois}>
                  <tr style={{ opacity: active || canOpen ? 1 : 0.5, cursor: canOpen ? "pointer" : "default" }} onClick={() => canOpen && toggleMonth(d.mois)}>
                    <td style={{ fontWeight: 600 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                        <ChevronRight size={14} style={{ color: "var(--ink-3)", transform: open ? "rotate(90deg)" : "none", transition: ".15s", opacity: canOpen ? 1 : 0 }} />
                        {d.mois}{canOpen && <span className="faint" style={{ fontSize: 11 }}>· {list.length}</span>}
                      </span>
                    </td>
                    <td className="t-center num">{d.nbT || (d.nbConf ? `(${d.nbConf})` : "—")}</td>
                    <td className="t-right num" style={{ fontWeight: 600 }}>{active ? fmtE(d.caR) : "—"}</td>
                    <td className="t-right num" style={{ color: "var(--st-new)" }}>{d.caConf > 0 ? fmtE(d.caConf) : (d.caPlan > 0 ? `${fmtE(d.caPlan)} pl.` : "—")}</td>
                    <td className="t-right num">{active ? fmtE(d.mb) : "—"}</td>
                    <td className="t-right num faint">{txMB != null ? fmtPct1(txMB) : "—"}</td>
                    <td className="t-right num" style={{ fontWeight: 600, color: active ? (nette >= 0 ? "var(--st-won)" : "var(--st-lost)") : "inherit" }}>{active ? fmtE(nette) : "—"}</td>
                    <td className="t-right num faint">{active ? fmtE(pm) : "—"}</td>
                    <td className="t-right num faint">{fmtE(objM)}</td>
                    <td className="t-right num" style={{ color: active ? (ecart >= 0 ? "var(--st-won)" : "var(--st-lost)") : "inherit" }}>{active ? `${ecart >= 0 ? "+" : "−"}${fmtE(Math.abs(ecart))}` : "—"}</td>
                    <td className="t-right num faint">{n1 ? fmtE(n1) : "—"}</td>
                    <td className="t-center">{active ? <Badge color={nette >= 0 ? "var(--st-won)" : "var(--st-lost)"} bg={nette >= 0 ? "var(--st-won-bg)" : "var(--st-lost-bg)"} dot>{nette >= 0 ? "Oui" : "Non"}</Badge> : <span className="faint">—</span>}</td>
                  </tr>
                  {open && (
                    <tr className="month-detail">
                      <td colSpan={12} style={{ padding: 0, background: "var(--surface-2)" }}>
                        <table className="tbl tbl-inner" style={{ margin: 0 }}>
                          <thead><tr>
                            <th>Date</th><th>Formation</th><th>Client</th><th>Formateur</th><th className="t-center">Cand.</th>
                            <th className="t-right">CA HT</th><th className="t-right">Marge</th><th className="t-right">Tx</th><th>État</th>
                          </tr></thead>
                          <tbody>
                            {list.map(({ s, c }) => {
                              const fo = formById(s.formationId), es = ETAT_STYLE[c.etat];
                              return (
                                <tr key={s.id} style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); setEditing(s); setShowNew(false); }}>
                                  <td className="num faint" style={{ whiteSpace: "nowrap" }}>{frDate(s.date)}</td>
                                  <td><span className="tag" style={{ color: fo?.color, borderColor: fo?.color + "44" }}>{fo?.code || "—"}</span></td>
                                  <td style={{ fontWeight: 600 }}>{s.client}</td>
                                  <td className="faint" style={{ fontSize: 12 }}>{s.formateur || "—"}</td>
                                  <td className="t-center num">{s.nbCand != null && s.nbCand !== "" ? s.nbCand : "—"}</td>
                                  <td className="t-right num" style={{ fontWeight: 600 }}>{c.caht ? fmtE(c.caht) : "—"}</td>
                                  <td className="t-right num" style={{ color: c.tx != null && c.tx < 0.4 ? "var(--st-lost)" : "var(--brand)" }}>{c.caht ? fmtE(c.mb) : "—"}</td>
                                  <td className="t-right num faint">{c.tx != null ? fmtPct(c.tx) : "—"}</td>
                                  <td><Badge color={es.color} bg={es.bg} dot>{c.etat}</Badge></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                  </Fragment>
                );
              })}
              <tr style={{ background: "var(--surface-2)", borderTop: "2px solid var(--line)" }}>
                <td style={{ fontWeight: 800 }}>TOTAL</td>
                <td className="t-center num" style={{ fontWeight: 800 }}>{agg.nbT}</td>
                <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(agg.caR)}</td>
                <td className="t-right num" style={{ fontWeight: 800, color: "var(--st-new)" }}>{fmtE(agg.caConf)}</td>
                <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(agg.mbR)}</td>
                <td className="t-right num" style={{ fontWeight: 800 }}>{fmtPct1(agg.txMB)}</td>
                <td className="t-right num" style={{ fontWeight: 800, color: agg.margeNette >= 0 ? "var(--st-won)" : "var(--st-lost)" }}>{fmtE(agg.margeNette)}</td>
                <td className="t-right num faint" style={{ fontWeight: 800 }}>{fmtE(agg.pointMort)}</td>
                <td className="t-right num faint" style={{ fontWeight: 800 }}>{fmtE(agg.objAnnuel)}</td>
                <td className="t-right num" style={{ fontWeight: 800, color: agg.atterrissage >= agg.objAnnuel ? "var(--st-won)" : "var(--st-lost)" }}>{`${agg.atterrissage >= agg.objAnnuel ? "+" : "−"}${fmtE(Math.abs(agg.atterrissage - agg.objAnnuel))}`}</td>
                <td className="t-right num faint" style={{ fontWeight: 800 }}>{fmtE(MOIS.reduce((a, m) => a + n1Ca(m, P), 0))}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div style={{ padding: "10px 14px", fontSize: 11.5, color: "var(--ink-3)", borderTop: "1px solid var(--line-2)" }}>
            « À venir » = sessions signées non encore tenues (ou planifiées « pl. »). Objectif mensuel = objectif annuel réparti selon la saisonnalité N‑1. Marge nette = marge brute − (charges + marketing). Écart total = atterrissage (réalisé + confirmé) vs objectif annuel.
          </div>
        </div>
      )}

      {sub === "formation" && (
        <>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1.4fr", alignItems: "start" }}>
            <div className="card card-pad">
              <div className="eyebrow">Répartition</div>
              <h3 style={{ fontSize: 15, margin: "3px 0 8px" }}>Part du CA par formation</h3>
              <div style={{ height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={82} paddingAngle={2}>
                      {pieData.map((c) => <Cell key={c.name} fill={c.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                {pieData.map((c) => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                    <span className="dot" style={{ background: c.color }} /><span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span className="num faint" style={{ marginLeft: "auto" }}>{fmtPct(c.value / (parFormation.totalCA || 1))}</span>
                    <span className="num" style={{ fontWeight: 600, width: 78, textAlign: "right" }}>{fmtE(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card card-pad">
              <div className="eyebrow">Classement</div>
              <h3 style={{ fontSize: 15, margin: "3px 0 8px" }}>Marge brute par formation</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={parFormation.rows} layout="vertical" margin={{ top: 6, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => `${Math.round(v / 1000)}k`} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="code" width={66} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "var(--surface-2)" }} />
                    <Bar dataKey="mb" name="Marge brute" radius={[0, 6, 6, 0]} maxBarSize={26}>
                      {parFormation.rows.map((x) => <Cell key={x.id} fill={x.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card scroll-x" style={{ marginTop: 16 }}>
            <table className="tbl">
              <thead><tr>
                <th style={{ width: 38 }}>#</th><th>Formation</th><th className="t-right">CA réalisé</th><th className="t-right">Coûts directs</th>
                <th className="t-right">Marge brute</th><th className="t-right">Taux marge</th><th className="t-center">Sessions</th><th className="t-center">Particip.</th><th className="t-right">Remplissage</th>
              </tr></thead>
              <tbody>
                {parFormation.rows.map((x, i) => {
                  const rankColor = i === 0 ? "#029393" : i === parFormation.rows.length - 1 ? "#e02436" : "#4a5b58";
                  const rankBg = i === 0 ? "#e0f3f3" : i === parFormation.rows.length - 1 ? "#fdeaec" : "var(--surface-3)";
                  return (
                    <tr key={x.id}>
                      <td><span className="rank-badge" style={{ background: rankBg, color: rankColor }}>{i + 1}</span></td>
                      <td><div style={{ display: "flex", alignItems: "center", gap: 9 }}><span className="dot" style={{ background: x.color, width: 9, height: 9 }} /><div><div style={{ fontWeight: 700 }}>{x.code}</div><div className="faint" style={{ fontSize: 11.5 }}>{x.nom}</div></div></div></td>
                      <td className="t-right num" style={{ fontWeight: 700 }}>{fmtE(x.ca)}</td>
                      <td className="t-right num faint">{fmtE(x.cout)}</td>
                      <td className="t-right num" style={{ fontWeight: 600, color: "var(--brand)" }}>{fmtE(x.mb)}</td>
                      <td className="t-right"><span className="badge" style={{ color: x.taux >= 0.7 ? "var(--st-won)" : x.taux >= 0.5 ? "var(--gold)" : "var(--st-lost)", background: x.taux >= 0.7 ? "var(--st-won-bg)" : x.taux >= 0.5 ? "var(--gold-50)" : "var(--st-lost-bg)" }}>{fmtPct1(x.taux)}</span></td>
                      <td className="t-center num">{x.nb}</td>
                      <td className="t-center num">{x.part}</td>
                      <td className="t-right"><div style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "flex-end" }}><div className="bar-track" style={{ width: 46 }}><div style={{ height: "100%", width: `${Math.min(100, x.rempl * 100)}%`, background: x.color, borderRadius: 99 }} /></div><span className="num faint" style={{ fontSize: 12, width: 34 }}>{fmtPct(x.rempl)}</span></div></td>
                    </tr>
                  );
                })}
                {parFormation.rows.length === 0 && <tr><td colSpan={9} className="empty" style={{ padding: 22 }}>Aucune session tenue.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {sub === "formateur" && (
        <div className="card scroll-x">
          <div className="card-pad" style={{ paddingBottom: 0 }}><div className="eyebrow">Rentabilité par formateur</div><h3 style={{ fontSize: 15, margin: "3px 0 4px" }}>CA, marge et volume par formateur</h3><p className="faint" style={{ fontSize: 12, marginBottom: 10 }}>Sessions réalisées + confirmées. Le coût formateur est votre 1<sup>er</sup> poste variable.</p></div>
          <table className="tbl">
            <thead><tr><th style={{ width: 38 }}>#</th><th>Formateur</th><th className="t-center">Sessions</th><th className="t-right">CA généré</th><th className="t-right">Coût formateur cumulé</th><th className="t-right">Coût moyen / sess.</th><th className="t-right">Marge brute</th><th className="t-right">Taux marge</th><th className="t-center">Heures</th></tr></thead>
            <tbody>
              {parFormateur.map((x, i) => (
                <tr key={x.name}>
                  <td><span className="rank-badge" style={{ background: i === 0 ? "#e0f3f3" : "var(--surface-3)", color: i === 0 ? "#029393" : "#475467" }}>{i + 1}</span></td>
                  <td style={{ fontWeight: 700 }}>{x.name}</td>
                  <td className="t-center num">{x.nb}</td>
                  <td className="t-right num" style={{ fontWeight: 700 }}>{fmtE(x.ca)}</td>
                  <td className="t-right num faint">{fmtE(x.cout)}</td>
                  <td className="t-right num faint">{fmtE(x.coutMoyen)}</td>
                  <td className="t-right num" style={{ fontWeight: 600, color: "var(--brand)" }}>{fmtE(x.mb)}</td>
                  <td className="t-right"><span className="badge" style={{ color: x.taux >= 0.7 ? "var(--st-won)" : x.taux >= 0.5 ? "var(--gold)" : "var(--st-lost)", background: x.taux >= 0.7 ? "var(--st-won-bg)" : x.taux >= 0.5 ? "var(--gold-50)" : "var(--st-lost-bg)" }}>{fmtPct1(x.taux)}</span></td>
                  <td className="t-center num faint">{Math.round(x.heures)} h</td>
                </tr>
              ))}
              {parFormateur.length === 0 && <tr><td colSpan={9} className="empty" style={{ padding: 22 }}>Aucune session.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {sub === "client" && (
        <>
          <div className="card card-pad">
            <div className="eyebrow">Top clients</div>
            <h3 style={{ fontSize: 15, margin: "3px 0 4px" }}>CA signé par client (réalisé + à venir)</h3>
            <p className="faint" style={{ fontSize: 12, marginBottom: 10 }}>15 premiers clients par chiffre d'affaires.</p>
            <div style={{ height: Math.max(220, Math.min(15, parClient.rows.length) * 30 + 20) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={parClient.rows.slice(0, 15)} layout="vertical" margin={{ top: 4, right: 60, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `${Math.round(v / 1000)}k`} tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis type="category" dataKey="name" width={150} tickLine={false} axisLine={false} fontSize={11.5} interval={0} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "var(--surface-2)" }} />
                  <Bar dataKey="ca" name="CA signé" fill="#029393" radius={[0, 5, 5, 0]} maxBarSize={22}
                    label={{ position: "right", formatter: (v) => fmtE(v), fontSize: 10.5, fill: "var(--ink-3)" }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card scroll-x" style={{ marginTop: 16 }}>
            <div className="card-pad" style={{ paddingBottom: 0, display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
              <div><div className="eyebrow">Récapitulatif</div><h3 style={{ fontSize: 15, margin: "3px 0 4px" }}>CA par client</h3></div>
              <span className="faint" style={{ fontSize: 12 }}>{parClient.rows.length} clients · {fmtE(parClient.total)} de CA signé</span>
            </div>
            <table className="tbl">
              <thead><tr><th style={{ width: 38 }}>#</th><th>Client</th><th>Provenance</th><th className="t-center">Sessions</th><th className="t-right">CA réalisé</th><th className="t-right">CA signé</th><th className="t-right">Part</th><th className="t-right">Marge brute</th><th className="t-right">Taux marge</th><th>Dernière session</th></tr></thead>
              <tbody>
                {parClient.rows.map((x, i) => (
                  <tr key={x.name}>
                    <td><span className="rank-badge" style={{ background: i === 0 ? "#e0f3f3" : "var(--surface-3)", color: i === 0 ? "#029393" : "#475467" }}>{i + 1}</span></td>
                    <td style={{ fontWeight: 700 }}>{x.name}{x.nb >= 2 && <Badge color="var(--gold)" bg="var(--gold-50)" >Récurrent</Badge>}</td>
                    <td><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{x.provList.length ? x.provList.slice(0, 2).map((pv) => <span key={pv} className="tag" style={{ fontSize: 10.5 }}>{pv}</span>) : <span className="faint">—</span>}{x.provList.length > 2 && <span className="faint" style={{ fontSize: 11 }}>+{x.provList.length - 2}</span>}</div></td>
                    <td className="t-center num">{x.nb}</td>
                    <td className="t-right num">{fmtE(x.caReel)}</td>
                    <td className="t-right num" style={{ fontWeight: 700 }}>{fmtE(x.ca)}</td>
                    <td className="t-right num faint">{fmtPct(x.ca / (parClient.total || 1))}</td>
                    <td className="t-right num" style={{ fontWeight: 600, color: "var(--brand)" }}>{fmtE(x.mb)}</td>
                    <td className="t-right"><span className="badge" style={{ color: x.taux >= 0.7 ? "var(--st-won)" : x.taux >= 0.5 ? "var(--gold)" : "var(--st-lost)", background: x.taux >= 0.7 ? "var(--st-won-bg)" : x.taux >= 0.5 ? "var(--gold-50)" : "var(--st-lost-bg)" }}>{fmtPct1(x.taux)}</span></td>
                    <td className="num faint">{x.last ? frDate(x.last) : "—"}</td>
                  </tr>
                ))}
                {parClient.rows.length > 0 && (
                  <tr style={{ background: "var(--surface-2)", borderTop: "2px solid var(--line)" }}>
                    <td></td><td style={{ fontWeight: 800 }}>TOTAL</td><td></td>
                    <td className="t-center num" style={{ fontWeight: 800 }}>{parClient.rows.reduce((a, x) => a + x.nb, 0)}</td>
                    <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(parClient.rows.reduce((a, x) => a + x.caReel, 0))}</td>
                    <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(parClient.total)}</td>
                    <td></td>
                    <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(parClient.rows.reduce((a, x) => a + x.mb, 0))}</td>
                    <td></td><td></td>
                  </tr>
                )}
                {parClient.rows.length === 0 && <tr><td colSpan={10} className="empty" style={{ padding: 22 }}>Aucune session.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {(showNew || editing) && <SessionModal session={editing} onClose={() => { setShowNew(false); setEditing(null); }} onSave={saveSession} />}
      {showParams && <ParamsModal params={P} onClose={() => setShowParams(false)} onSave={setParams} />}
    </>
  );
}

/* ============================================================= *
 *  VUE — ACQUISITION (prospects décrochés : jour / semaine / synthèse)
 * ============================================================= */
function Acquisition({ prospects, factures, params, setParams, goto }) {
  const [sub, setSub] = useState("quotidien");

  const A = useMemo(() => {
    const withDate = prospects.filter((p) => p.dateCreation);
    const byDay = {}, byWeek = {}, byMonth = {};
    withDate.forEach((p) => {
      (byDay[p.dateCreation] = byDay[p.dateCreation] || []).push(p);
      const wk = weekKeyOf(p.dateCreation); (byWeek[wk] = byWeek[wk] || []).push(p);
      const mo = moisLongFromDate(p.dateCreation); (byMonth[mo] = byMonth[mo] || []).push(p);
    });
    const stat = (list) => {
      const gagnes = list.filter((p) => p.stage === "gagne");
      return {
        n: list.length, montant: list.reduce((a, p) => a + p.montant, 0),
        gagnes: gagnes.length, valGagne: gagnes.reduce((a, p) => a + p.montant, 0),
        perdus: list.filter((p) => p.stage === "perdu").length,
        npert: list.filter((p) => p.stage === "npertinent").length,
        ouverts: list.filter(isOpen).length,
        taux: list.length ? gagnes.length / list.length : 0, top: topSource(list),
      };
    };
    const days = Object.keys(byDay).sort((a, b) => b.localeCompare(a)).map((d) => ({ date: d, list: byDay[d], ...stat(byDay[d]) }));
    const weeks = Object.keys(byWeek).sort((a, b) => b.localeCompare(a)).map((k) => ({ key: k, list: byWeek[k], semaine: isoWeekNum(new Date(k)), range: frWeekRange(k), ...stat(byWeek[k]) }));
    const months = Object.keys(byMonth).map((k) => {
      const list = byMonth[k];
      const sortKey = list.reduce((a, p) => (p.dateCreation < a ? p.dateCreation : a), "9999");
      return { key: k, sortKey, list, ...stat(list) };
    }).sort((a, b) => b.sortKey.localeCompare(a.sortKey));

    const wkNow = weekKeyOf(TODAY_ISO), moNow = moisLongFromDate(TODAY_ISO);
    const sem = stat(byWeek[wkNow] || []), mois = stat(byMonth[moNow] || []);
    const chart = [];
    for (let i = 20; i >= 0; i--) { const x = new Date(today); x.setDate(x.getDate() - i); const iso = isoOf(x); chart.push({ jour: x.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }), n: (byDay[iso] || []).length }); }
    return { days, weeks, months, sem, mois, chart, total: withDate.length };
  }, [prospects]);

  const Row = ({ p }) => {
    const f = formById(p.formationId), st = stageById(p.stage);
    return (
      <div onClick={() => goto("crm", p.id)} className="acq-row">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.entreprise}</div>
          <div className="faint" style={{ fontSize: 11.5 }}>{p.contact || "—"} · {p.source}</div>
        </div>
        <span className="tag" style={{ color: f?.color, borderColor: f?.color + "44", flexShrink: 0 }}>{f?.code}</span>
        <span className="num" style={{ fontWeight: 700, fontSize: 12.5, width: 78, textAlign: "right", flexShrink: 0 }}>{fmtE(p.montant)}</span>
        <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
      </div>
    );
  };

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <Kpi label="Décrochés cette semaine" value={A.sem.n} sub={`${fmtE(A.sem.montant)} de pipeline`} icon={PhoneIncoming} accent="#e02436" chipBg="#fdeaec" />
        <Kpi label="Décrochés ce mois" value={A.mois.n} sub={`${A.mois.ouverts} encore ouverts`} icon={CalendarDays} accent="#00b4bc" chipBg="#e3f6f7" />
        <Kpi label="Pipeline généré (mois)" value={fmtE(A.mois.montant)} sub={`taux transfo ${fmtPct(A.mois.taux)}`} icon={Target} accent="#ef7507" chipBg="#fdeede" />
        <Kpi label="Meilleure source (mois)" value={A.mois.top} sub="canal le plus productif" icon={Award} accent="#b5760a" chipBg="#fdf3df" />
      </div>

      <div className="section-title" style={{ marginTop: 16 }}>
        <div className="pill-tab">
          {[["quotidien", "Quotidien"], ["hebdo", "Hebdomadaire"], ["synthese", "Synthèses"], ["roi", "ROI par canal"]].map(([k, l]) => (
            <button key={k} className={sub === k ? "on" : ""} onClick={() => setSub(k)}>{l}</button>
          ))}
        </div>
        <span className="faint" style={{ fontSize: 12.5 }}>{A.total} prospects décrochés au total</span>
      </div>

      {sub === "quotidien" && (
        <>
          <div className="card card-pad">
            <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 6 }}><BarChart3 size={13} /> Décrochés par jour — 3 dernières semaines</div>
            <div style={{ height: 150, marginTop: 10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={A.chart} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                  <XAxis dataKey="jour" tickLine={false} axisLine={false} fontSize={11} interval={2} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "var(--surface-2)" }} />
                  <Bar dataKey="n" name="Décrochés" fill="#e02436" radius={[4, 4, 0, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {A.days.map((day) => (
              <div className="card" key={day.date}>
                <div className="card-pad" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--line-2)" }}>
                  <h3 style={{ fontSize: 14 }}>{frDayLong(day.date)}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="faint" style={{ fontSize: 12 }}>{day.n} décroché{day.n > 1 ? "s" : ""}</span>
                    <span className="num" style={{ fontWeight: 700 }}>{fmtE(day.montant)}</span>
                  </div>
                </div>
                <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 6, paddingBottom: 6 }}>
                  {day.list.map((p) => <Row key={p.id} p={p} />)}
                </div>
              </div>
            ))}
            {A.days.length === 0 && <div className="card empty" style={{ padding: 30 }}>Aucun prospect décroché pour le moment.</div>}
          </div>
        </>
      )}

      {sub === "hebdo" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {A.weeks.map((w) => (
            <div className="card" key={w.key}>
              <div className="card-pad" style={{ paddingBottom: 10, borderBottom: "1px solid var(--line-2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 6 }}><CalendarRange size={13} /> Semaine {w.semaine}</div>
                    <h3 style={{ fontSize: 14, marginTop: 2 }}>{w.range}</h3>
                  </div>
                  <div style={{ display: "flex", gap: 20, textAlign: "right" }}>
                    <div><div className="num" style={{ fontWeight: 800, fontSize: 16 }}>{w.n}</div><div className="faint" style={{ fontSize: 10.5 }}>décrochés</div></div>
                    <div><div className="num" style={{ fontWeight: 800, fontSize: 16 }}>{fmtE(w.montant)}</div><div className="faint" style={{ fontSize: 10.5 }}>pipeline</div></div>
                    <div><div className="num" style={{ fontWeight: 800, fontSize: 16, color: "var(--st-won)" }}>{w.gagnes}</div><div className="faint" style={{ fontSize: 10.5 }}>gagnés</div></div>
                    <div><div className="num" style={{ fontWeight: 800, fontSize: 16 }}>{fmtPct(w.taux)}</div><div className="faint" style={{ fontSize: 10.5 }}>transfo</div></div>
                  </div>
                </div>
              </div>
              <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 6, paddingBottom: 6 }}>
                {w.list.slice().sort((a, b) => b.dateCreation.localeCompare(a.dateCreation)).map((p) => <Row key={p.id} p={p} />)}
              </div>
            </div>
          ))}
          {A.weeks.length === 0 && <div className="card empty" style={{ padding: 30 }}>Aucune semaine d'acquisition à afficher.</div>}
        </div>
      )}

      {sub === "synthese" && (
        <>
          <div className="card scroll-x">
            <div className="card-pad" style={{ paddingBottom: 0 }}><div className="eyebrow">Synthèse hebdomadaire</div><h3 style={{ fontSize: 15, margin: "3px 0 10px" }}>Acquisition par semaine</h3></div>
            <table className="tbl">
              <thead><tr><th>Semaine</th><th>Période</th><th className="t-center">Décrochés</th><th className="t-right">Pipeline</th><th className="t-center">Gagnés</th><th className="t-right">Valeur gagnée</th><th className="t-center">Non pert.</th><th className="t-right">Taux transfo</th><th>Top source</th></tr></thead>
              <tbody>
                {A.weeks.map((w) => (
                  <tr key={w.key}>
                    <td style={{ fontWeight: 700 }}>S{w.semaine}</td>
                    <td className="faint num">{w.range}</td>
                    <td className="t-center num" style={{ fontWeight: 700 }}>{w.n}</td>
                    <td className="t-right num">{fmtE(w.montant)}</td>
                    <td className="t-center num" style={{ color: "var(--st-won)", fontWeight: 600 }}>{w.gagnes}</td>
                    <td className="t-right num">{fmtE(w.valGagne)}</td>
                    <td className="t-center num faint">{w.npert || "—"}</td>
                    <td className="t-right"><span className="badge" style={{ color: w.taux >= 0.3 ? "var(--st-won)" : "var(--gold)", background: w.taux >= 0.3 ? "var(--st-won-bg)" : "var(--gold-50)" }}>{fmtPct(w.taux)}</span></td>
                    <td className="faint">{w.top}</td>
                  </tr>
                ))}
                {A.weeks.length === 0 && <tr><td colSpan={9} className="empty" style={{ padding: 22 }}>Aucune donnée.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="card scroll-x" style={{ marginTop: 16 }}>
            <div className="card-pad" style={{ paddingBottom: 0 }}><div className="eyebrow">Synthèse mensuelle</div><h3 style={{ fontSize: 15, margin: "3px 0 10px" }}>Acquisition par mois</h3></div>
            <table className="tbl">
              <thead><tr><th>Mois</th><th className="t-center">Décrochés</th><th className="t-right">Pipeline généré</th><th className="t-center">Gagnés</th><th className="t-center">Perdus</th><th className="t-center">Non pert.</th><th className="t-right">Valeur gagnée</th><th className="t-right">Taux transfo</th><th>Top source</th></tr></thead>
              <tbody>
                {A.months.map((mo) => (
                  <tr key={mo.key}>
                    <td style={{ fontWeight: 700, textTransform: "capitalize" }}>{mo.key}</td>
                    <td className="t-center num" style={{ fontWeight: 700 }}>{mo.n}</td>
                    <td className="t-right num">{fmtE(mo.montant)}</td>
                    <td className="t-center num" style={{ color: "var(--st-won)", fontWeight: 600 }}>{mo.gagnes}</td>
                    <td className="t-center num faint">{mo.perdus || "—"}</td>
                    <td className="t-center num faint">{mo.npert || "—"}</td>
                    <td className="t-right num">{fmtE(mo.valGagne)}</td>
                    <td className="t-right"><span className="badge" style={{ color: mo.taux >= 0.3 ? "var(--st-won)" : "var(--gold)", background: mo.taux >= 0.3 ? "var(--st-won-bg)" : "var(--gold-50)" }}>{fmtPct(mo.taux)}</span></td>
                    <td className="faint">{mo.top}</td>
                  </tr>
                ))}
                {A.months.length === 0 && <tr><td colSpan={9} className="empty" style={{ padding: 22 }}>Aucune donnée.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {sub === "roi" && (() => {
        const canaux = {};
        const ensure = (k) => (canaux[k] = canaux[k] || { canal: k, leads: 0, gagnes: 0, perdus: 0, caGagne: 0, caSess: 0, mbSess: 0 });
        (prospects || []).forEach((p) => { const k = origineLabel(p) || "—"; const x = ensure(k); x.leads++; if (p.stage === "gagne") { x.gagnes++; x.caGagne += p.montant || 0; } if (p.stage === "perdu") x.perdus++; });
        (factures || []).forEach((s) => { const c = computeSession(s, params); if (c.etat === "Annulée" || c.etat === "Planifiée") return; const k = s.origine || s.source || "—"; const x = ensure(k); x.caSess += c.caht; x.mbSess += c.mb; });
        const spend = (params && params.canalSpend) || {};
        const rows = Object.values(canaux).map((x) => {
          const dep = nval(spend[x.canal]);
          return { ...x, dep, conv: x.leads ? x.gagnes / x.leads : 0, roas: dep > 0 ? x.caSess / dep : null, coutLead: dep > 0 && x.leads ? dep / x.leads : null, coutAcq: dep > 0 && x.gagnes ? dep / x.gagnes : null };
        }).sort((a, b) => b.caSess - a.caSess);
        const totDep = rows.reduce((a, x) => a + x.dep, 0), totCA = rows.reduce((a, x) => a + x.caSess, 0), totMB = rows.reduce((a, x) => a + x.mbSess, 0);
        const setSpend = (canal, v) => setParams && setParams({ ...params, canalSpend: { ...spend, [canal]: v === "" ? 0 : +v } });
        return (
          <>
            <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              <Kpi label="Dépense marketing saisie" value={fmtE(totDep)} sub="cumul tous canaux" icon={Megaphone} accent="#ef7507" chipBg="#fdeede" />
              <Kpi label="CA généré (signé)" value={fmtE(totCA)} sub="réalisé + confirmé" icon={Banknote} accent="#029393" chipBg="#e0f3f3" />
              <Kpi label="ROAS global" value={totDep > 0 ? `${(totCA / totDep).toFixed(1)} ×` : "—"} sub="CA ÷ dépense" icon={TrendingUp} accent="#e02436" chipBg="#fdeaec" />
              <Kpi label="Marge − dépense" value={fmtE(totMB - totDep)} sub="contribution nette des canaux" icon={CircleDollarSign} accent={(totMB - totDep) >= 0 ? "#029393" : "#e02436"} chipBg={(totMB - totDep) >= 0 ? "#e0f3f3" : "#fdeaec"} />
            </div>
            <div className="card scroll-x" style={{ marginTop: 14 }}>
              <div className="card-pad" style={{ paddingBottom: 0 }}><div className="eyebrow">Performance par canal d'acquisition</div><h3 style={{ fontSize: 15, margin: "3px 0 4px" }}>Où va l'argent, d'où vient le chiffre</h3><p className="faint" style={{ fontSize: 12, marginBottom: 8 }}>Saisissez la dépense par canal (colonne éditable) pour obtenir le ROAS et le coût d'acquisition.</p></div>
              <table className="tbl">
                <thead><tr><th>Canal</th><th className="t-center">Leads</th><th className="t-center">Gagnés</th><th className="t-right">Conv.</th><th className="t-right">CA signé</th><th className="t-right">Marge</th><th className="t-right" style={{ width: 120 }}>Dépense €</th><th className="t-right">ROAS</th><th className="t-right">Coût / lead</th><th className="t-right">Coût / client</th></tr></thead>
                <tbody>
                  {rows.map((x) => (
                    <tr key={x.canal}>
                      <td style={{ fontWeight: 600 }}>{x.canal}</td>
                      <td className="t-center num">{x.leads || "—"}</td>
                      <td className="t-center num">{x.gagnes || "—"}</td>
                      <td className="t-right num faint">{x.leads ? fmtPct(x.conv) : "—"}</td>
                      <td className="t-right num" style={{ fontWeight: 700 }}>{x.caSess ? fmtE(x.caSess) : "—"}</td>
                      <td className="t-right num" style={{ color: "var(--brand)" }}>{x.mbSess ? fmtE(x.mbSess) : "—"}</td>
                      <td className="t-right"><input className="input num" type="number" min="0" value={spend[x.canal] ?? ""} onChange={(e) => setSpend(x.canal, e.target.value)} placeholder="0" style={{ width: 100, textAlign: "right", padding: "5px 8px" }} /></td>
                      <td className="t-right num" style={{ fontWeight: 700, color: x.roas == null ? "var(--ink-3)" : x.roas >= 3 ? "var(--st-won)" : x.roas >= 1 ? "var(--gold)" : "var(--st-lost)" }}>{x.roas != null ? `${x.roas.toFixed(1)} ×` : "—"}</td>
                      <td className="t-right num faint">{x.coutLead != null ? fmtE(x.coutLead) : "—"}</td>
                      <td className="t-right num faint">{x.coutAcq != null ? fmtE(x.coutAcq) : "—"}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && <tr><td colSpan={10} className="empty" style={{ padding: 22 }}>Aucune donnée.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}
    </>
  );
}

/* ============================================================= *
 *  APPLICATION
 * ============================================================= */
/* ============================================================= *
 *  VUE — CLIENTS (comptes & historique)
 * ============================================================= */
function ClientsView({ factures, prospects, goto }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("ca");
  const data = useMemo(() => {
    const map = {};
    const norm = (s) => (s || "").trim();
    factures.forEach((s) => {
      const name = norm(s.client); if (!name) return;
      const c = computeSession(s);
      const m = map[name] || (map[name] = { name, ca: 0, caReel: 0, mb: 0, nb: 0, last: "", first: "9999", formations: {}, financements: {}, planifie: 0, annule: 0 });
      if (c.etat === "Annulée") { m.annule++; return; }
      if (c.etat === "Planifiée") { m.planifie++; return; }
      m.ca += c.caht; if (c.etat === "Réalisée") m.caReel += c.caht; m.mb += c.mb; m.nb++;
      if (s.date > m.last) m.last = s.date; if (s.date < m.first) m.first = s.date;
      const fo = formById(s.formationId); if (fo) m.formations[fo.code] = (m.formations[fo.code] || 0) + 1;
      if (s.financement) m.financements[s.financement] = (m.financements[s.financement] || 0) + 1;
    });
    // prospects ouverts par client (entreprise)
    const openByClient = {};
    (prospects || []).filter((p) => !["gagne", "perdu", "npertinent"].includes(p.stage)).forEach((p) => {
      const n = norm(p.entreprise); if (!n) return; openByClient[n] = (openByClient[n] || 0) + (p.montant || 0) * (p.proba || 0) / 100;
    });
    let rows = Object.values(map).map((m) => ({ ...m, taux: m.ca ? m.mb / m.ca : 0, recurrent: m.nb >= 2, pondere: openByClient[m.name] || 0 }));
    const term = q.toLowerCase().trim();
    if (term) rows = rows.filter((r) => r.name.toLowerCase().includes(term));
    rows.sort((a, b) => sort === "ca" ? b.ca - a.ca : sort === "nb" ? b.nb - a.nb : sort === "recent" ? (b.last || "").localeCompare(a.last || "") : b.mb - a.mb);
    const totalCA = rows.reduce((a, r) => a + r.ca, 0);
    const recurrents = rows.filter((r) => r.recurrent);
    const partRec = totalCA ? recurrents.reduce((a, r) => a + r.ca, 0) / totalCA : 0;
    return { rows, nb: rows.length, recurrents: recurrents.length, partRec, top: rows[0] };
  }, [factures, prospects, q, sort]);

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <Kpi label="Clients actifs" value={data.nb} sub="ayant ≥ 1 session signée" icon={Building2} accent="#029393" chipBg="#e0f3f3" />
        <Kpi label="Clients récurrents" value={data.recurrents} sub="≥ 2 sessions" icon={Crown} accent="#b5760a" chipBg="#fdf3df" />
        <Kpi label="Part CA récurrent" value={fmtPct(data.partRec)} sub="poids des clients fidèles" icon={Percent} accent="#7a5af8" chipBg="#fdeede" />
        <Kpi label="Meilleur client" value={data.top ? data.top.name : "—"} sub={data.top ? fmtE(data.top.ca) + " de CA signé" : ""} icon={Award} accent="#e02436" chipBg="#fdeaec" />
      </div>

      <div className="section-title" style={{ marginTop: 14 }}>
        <div style={{ position: "relative" }}>
          <Search size={15} color="var(--ink-3)" style={{ position: "absolute", left: 11, top: 10 }} />
          <input className="input" style={{ paddingLeft: 32, width: 260 }} placeholder="Rechercher un client…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="pill-tab">
          {[["ca", "CA"], ["mb", "Marge"], ["nb", "Sessions"], ["recent", "Récence"]].map(([k, l]) => (
            <button key={k} className={sort === k ? "on" : ""} onClick={() => setSort(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="card scroll-x">
        <table className="tbl">
          <thead><tr><th>Client</th><th className="t-center">Sessions</th><th className="t-right">CA réalisé</th><th className="t-right">CA signé</th><th className="t-right">Marge</th><th className="t-right">Taux</th><th>Formations</th><th>Dernière</th><th className="t-right">Pipeline pondéré</th></tr></thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.name}>
                <td style={{ fontWeight: 700 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{r.name}{r.recurrent && <Badge color="var(--gold)" bg="var(--gold-50)">Récurrent</Badge>}</div>
                </td>
                <td className="t-center num">{r.nb}{r.planifie ? <span className="faint"> +{r.planifie}pl.</span> : ""}</td>
                <td className="t-right num">{fmtE(r.caReel)}</td>
                <td className="t-right num" style={{ fontWeight: 700 }}>{fmtE(r.ca)}</td>
                <td className="t-right num" style={{ color: "var(--brand)" }}>{fmtE(r.mb)}</td>
                <td className="t-right num faint">{fmtPct1(r.taux)}</td>
                <td><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{Object.entries(r.formations).map(([code, n]) => { const fo = FORMATIONS.find((f) => f.code === code); return <span key={code} className="tag" style={{ color: fo?.color, borderColor: (fo?.color || "#999") + "44" }}>{code}{n > 1 ? `·${n}` : ""}</span>; })}</div></td>
                <td className="num faint">{r.last ? frDate(r.last) : "—"}</td>
                <td className="t-right num" style={{ color: r.pondere ? "var(--st-new)" : "var(--ink-3)" }}>{r.pondere ? fmtE(r.pondere) : "—"}</td>
              </tr>
            ))}
            {data.rows.length === 0 && <tr><td colSpan={9} className="empty" style={{ padding: 24 }}>Aucun client.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ============================================================= *
 *  VUE — COMPARATIF N-1 (exercice en cours vs exercice précédent)
 * ============================================================= */
function ComparatifView({ factures, params, setParams }) {
  const cur = useMemo(() => {
    const months = {}; MOIS.forEach((m) => (months[m] = { mois: m, ca: 0, marge: 0, sessions: 0, cand: 0 }));
    const form = {}, canal = {};
    let ca = 0, marge = 0, sessions = 0, cand = 0;
    const active = new Set();
    for (const s of factures) {
      const c = computeSession(s, params);
      if (c.etat === "Annulée" || c.etat === "Planifiée") continue;
      const k = moisLabelFromDate(s.date);
      const nb = nval(s.nbCand);
      if (months[k]) { months[k].ca += c.caht; months[k].marge += c.mb; months[k].sessions++; months[k].cand += nb; }
      ca += c.caht; marge += c.mb; sessions++; cand += nb;
      if (c.caht > 0) active.add(k);
      const fid = s.formationId || "—"; const f = form[fid] || (form[fid] = { ca: 0, marge: 0, sessions: 0, cand: 0 }); f.ca += c.caht; f.marge += c.mb; f.sessions++; f.cand += nb;
      const cn = s.origine || s.source || "—"; const cc = canal[cn] || (canal[cn] = { ca: 0, sessions: 0, cand: 0 }); cc.ca += c.caht; cc.sessions++; cc.cand += nb;
    }
    return { months, form, canal, ca, marge, sessions, cand, active };
  }, [factures, params]);

  const n1 = N1_DATA;
  const n1Override = (params && params.n1CA) || {};
  const n1Months = n1.months.map((m) => ({ ...m, ca: n1Ca(m.mois, params) }));
  const n1ById = Object.fromEntries(n1Months.map((m) => [m.mois, m]));
  const n1TotalCA = n1Months.reduce((a, m) => a + m.ca, 0);
  const setN1 = (mois, v) => setParams && setParams({ ...params, n1CA: { ...n1Override, [mois]: v === "" ? null : Math.round(Number(v) || 0) } });
  const resetN1 = () => setParams && setParams({ ...params, n1CA: {} });
  const edited = Object.values(n1Override).some((v) => v != null && v !== "");
  const txCur = cur.ca ? cur.marge / cur.ca : 0;
  const txN1 = n1TotalCA ? n1.total.marge / n1TotalCA : 0;
  // comparaison "à date" : N-1 limité aux mois déjà actifs cette année
  const n1SamePeriod = n1Months.filter((m) => cur.active.has(m.mois)).reduce((a, m) => a + m.ca, 0);
  const nbActive = cur.active.size;

  const delta = (c, p) => (p ? (c - p) / p : null);
  const DeltaTag = ({ c, p, invert }) => {
    const d = delta(c, p); if (d == null) return <span className="faint">—</span>;
    const pos = invert ? d <= 0 : d >= 0;
    return <span className="num" style={{ fontWeight: 700, fontSize: 12, color: pos ? "var(--st-won)" : "var(--st-lost)" }}>{d >= 0 ? "▲ +" : "▼ "}{fmtPct1(Math.abs(d))}</span>;
  };

  const kpis = [
    { lab: "Chiffre d'affaires", cur: fmtE(cur.ca), prev: fmtE(n1TotalCA), c: cur.ca, p: n1TotalCA, icon: Banknote, accent: "#e02436", bg: "#fdeaec" },
    { lab: "Marge brute", cur: fmtE(cur.marge), prev: fmtE(n1.total.marge), c: cur.marge, p: n1.total.marge, icon: TrendingUp, accent: "#029393", bg: "#e0f3f3" },
    { lab: "Taux de marge", cur: fmtPct1(txCur), prev: fmtPct1(txN1), c: txCur, p: txN1, icon: Percent, accent: "#7a5af8", bg: "#fdeede" },
    { lab: "Sessions", cur: String(cur.sessions), prev: String(n1.total.sessions), c: cur.sessions, p: n1.total.sessions, icon: Layers, accent: "#00b4bc", bg: "#e3f6f7" },
    { lab: "Candidats formés", cur: cur.cand.toLocaleString("fr-FR"), prev: n1.total.cand.toLocaleString("fr-FR"), c: cur.cand, p: n1.total.cand, icon: Users, accent: "#ef7507", bg: "#fdeede" },
  ];

  const chartData = MOIS.map((m) => {
    const cm = cur.months[m] || { ca: 0 }; const nm = n1ById[m] || { ca: 0 };
    return { mois: m, n: Math.round(cm.ca), n1: nm.ca };
  });

  const formRows = FORMATIONS.map((f) => {
    const c = cur.form[f.id] || { ca: 0, sessions: 0 }; const p = n1.parFormation[f.id] || { ca: 0, sessions: 0 };
    return { id: f.id, code: f.code, color: f.color, caC: c.ca, caP: p.ca, sC: c.sessions, sP: p.sessions };
  }).filter((r) => r.caC > 0 || r.caP > 0).sort((a, b) => (b.caC + b.caP) - (a.caC + a.caP));

  const canalKeys = [...new Set([...Object.keys(cur.canal), ...Object.keys(n1.parCanal)])];
  const canalRows = canalKeys.map((k) => {
    const c = cur.canal[k] || { ca: 0, sessions: 0 }; const p = n1.parCanal[k] || { ca: 0, sessions: 0 };
    return { canal: k, caC: c.ca, caP: p.ca, sC: c.sessions, sP: p.sessions };
  }).filter((r) => r.caC > 0 || r.caP > 0).sort((a, b) => (b.caC + b.caP) - (a.caC + a.caP));

  return (
    <>
      <div style={{ margin: "0 0 14px", padding: "11px 14px", borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--line-2)", fontSize: 12.5, color: "var(--ink-2)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <CalendarRange size={16} style={{ flexShrink: 0, marginTop: 1, color: "var(--brand)" }} />
        <span><b>Exercice en cours (2026‑2027)</b> = chiffre <b>signé à date</b> (réalisé + confirmé), donc partiel. <b>Exercice précédent ({n1.exercice})</b> = année <b>clôturée</b>. Les écarts globaux sont à lire en gardant cette différence de périmètre en tête ; la carte « à date » ci‑dessous compare à périmètre comparable.</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
        {kpis.map((k) => (
          <div key={k.lab} className="card card-pad">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div className="eyebrow">{k.lab}</div>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: k.bg, display: "grid", placeItems: "center" }}><k.icon size={15} color={k.accent} /></div>
            </div>
            <div className="num" style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{k.cur}</div>
            <div className="faint" style={{ fontSize: 11.5, marginTop: 2 }}>N‑1 clôturé : <b className="num" style={{ color: "var(--ink-2)" }}>{k.prev}</b></div>
            <div style={{ marginTop: 4 }}><DeltaTag c={k.c} p={k.p} /></div>
          </div>
        ))}
      </div>

      <div className="card card-pad" style={{ marginTop: 14, borderLeft: "3px solid var(--brand)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div className="eyebrow">À périmètre comparable</div>
            <h3 style={{ fontSize: 15, margin: "3px 0 2px" }}>CA signé à date vs N‑1 sur les mêmes mois</h3>
            <p className="faint" style={{ fontSize: 12 }}>Sur les {nbActive} mois déjà actifs cette année.</p>
          </div>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <div style={{ textAlign: "right" }}><div className="faint" style={{ fontSize: 11 }}>Exercice en cours</div><div className="num" style={{ fontSize: 20, fontWeight: 800 }}>{fmtE(cur.ca)}</div></div>
            <div style={{ textAlign: "right" }}><div className="faint" style={{ fontSize: 11 }}>N‑1 (mêmes mois)</div><div className="num" style={{ fontSize: 20, fontWeight: 800, color: "var(--ink-2)" }}>{fmtE(n1SamePeriod)}</div></div>
            <div style={{ textAlign: "right" }}><div className="faint" style={{ fontSize: 11 }}>Évolution</div><div style={{ fontSize: 20 }}><DeltaTag c={cur.ca} p={n1SamePeriod} /></div></div>
          </div>
        </div>
      </div>

      <div className="card card-pad" style={{ marginTop: 14 }}>
        <div className="eyebrow">Évolution mensuelle</div>
        <h3 style={{ fontSize: 15, margin: "3px 0 12px" }}>CA par mois — exercice en cours vs N‑1</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 6, right: 8, left: -6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="mois" tickLine={false} axisLine={false} fontSize={11.5} />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tickLine={false} axisLine={false} width={42} />
              <Tooltip content={<ChartTip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="n" name="Exercice en cours (signé)" fill="#029393" radius={[5, 5, 0, 0]} maxBarSize={26} />
              <Line dataKey="n1" name="Exercice précédent" stroke="#8a9b9a" strokeWidth={2.2} dot={{ r: 2.5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start", marginTop: 14 }}>
        <div className="card scroll-x">
          <div className="card-pad" style={{ paddingBottom: 0 }}><div className="eyebrow">Par formation</div><h3 style={{ fontSize: 15, margin: "3px 0 8px" }}>CA et sessions par formation</h3></div>
          <table className="tbl">
            <thead><tr><th>Formation</th><th className="t-right">CA en cours</th><th className="t-right">CA N‑1</th><th className="t-right">Δ</th><th className="t-center">Sess. (N / N‑1)</th></tr></thead>
            <tbody>
              {formRows.map((r) => (
                <tr key={r.id}>
                  <td><span className="tag" style={{ color: r.color, borderColor: r.color + "44" }}>{r.code}</span></td>
                  <td className="t-right num" style={{ fontWeight: 700 }}>{fmtE(r.caC)}</td>
                  <td className="t-right num faint">{fmtE(r.caP)}</td>
                  <td className="t-right"><DeltaTag c={r.caC} p={r.caP} /></td>
                  <td className="t-center num faint">{r.sC} / {r.sP}</td>
                </tr>
              ))}
              {formRows.length === 0 && <tr><td colSpan={5} className="empty" style={{ padding: 22 }}>Aucune donnée.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="card scroll-x">
          <div className="card-pad" style={{ paddingBottom: 0 }}><div className="eyebrow">Par canal d'acquisition</div><h3 style={{ fontSize: 15, margin: "3px 0 8px" }}>CA et sessions par canal</h3></div>
          <table className="tbl">
            <thead><tr><th>Canal</th><th className="t-right">CA en cours</th><th className="t-right">CA N‑1</th><th className="t-right">Δ</th><th className="t-center">Sess. (N / N‑1)</th></tr></thead>
            <tbody>
              {canalRows.map((r) => (
                <tr key={r.canal}>
                  <td style={{ fontWeight: 600 }}>{r.canal}</td>
                  <td className="t-right num" style={{ fontWeight: 700 }}>{fmtE(r.caC)}</td>
                  <td className="t-right num faint">{fmtE(r.caP)}</td>
                  <td className="t-right"><DeltaTag c={r.caC} p={r.caP} /></td>
                  <td className="t-center num faint">{r.sC} / {r.sP}</td>
                </tr>
              ))}
              {canalRows.length === 0 && <tr><td colSpan={5} className="empty" style={{ padding: 22 }}>Aucune donnée.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card scroll-x" style={{ marginTop: 14 }}>
        <div className="card-pad" style={{ paddingBottom: 0, display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
          <div><div className="eyebrow">Détail mensuel</div><h3 style={{ fontSize: 15, margin: "3px 0 2px" }}>Mois par mois — CA N‑1 corrigeable</h3><p className="faint" style={{ fontSize: 12 }}>Cliquez dans la colonne « CA N‑1 » pour corriger une valeur erronée.{edited && " (valeurs modifiées)"}</p></div>
          {edited && <button className="btn btn-sm" onClick={resetN1}><RotateCcw size={13} /> Réinitialiser N‑1</button>}
        </div>
        <table className="tbl">
          <thead><tr><th>Mois</th><th className="t-right">CA en cours</th><th className="t-right" style={{ minWidth: 130 }}>CA N‑1 (éditable)</th><th className="t-right">Δ</th><th className="t-center">Sessions N</th><th className="t-center">Sessions N‑1</th></tr></thead>
          <tbody>
            {MOIS.map((m) => {
              const cm = cur.months[m]; const nm = n1ById[m] || { ca: 0, sessions: 0 };
              const isOv = n1Override[m] != null && n1Override[m] !== "";
              return (
                <tr key={m}>
                  <td style={{ fontWeight: 600 }}>{m}</td>
                  <td className="t-right num" style={{ fontWeight: 600 }}>{cm.ca ? fmtE(cm.ca) : "—"}</td>
                  <td className="t-right">
                    <input className="input cell-input num" type="number" min="0" value={nm.ca || ""} placeholder="0"
                      onChange={(e) => setN1(m, e.target.value)}
                      style={{ width: 110, textAlign: "right", padding: "5px 8px", fontSize: 12.5, fontWeight: isOv ? 700 : 400, color: isOv ? "var(--brand)" : "inherit" }} />
                  </td>
                  <td className="t-right">{cm.ca || nm.ca ? <DeltaTag c={cm.ca} p={nm.ca} /> : <span className="faint">—</span>}</td>
                  <td className="t-center num">{cm.sessions || "—"}</td>
                  <td className="t-center num faint">{nm.sessions || "—"}</td>
                </tr>
              );
            })}
            <tr style={{ background: "var(--surface-2)", borderTop: "2px solid var(--line)" }}>
              <td style={{ fontWeight: 800 }}>TOTAL</td>
              <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(cur.ca)}</td>
              <td className="t-right num" style={{ fontWeight: 800 }}>{fmtE(n1TotalCA)}</td>
              <td className="t-right"><DeltaTag c={cur.ca} p={n1TotalCA} /></td>
              <td className="t-center num" style={{ fontWeight: 800 }}>{cur.sessions}</td>
              <td className="t-center num" style={{ fontWeight: 800 }}>{n1.total.sessions}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}


/* ============================================================= *
 *  TRANSFORMATION D'UNE DEMANDE EN PROSPECT
 *  L'origine est pré-remplie d'après la demande (canal + groupe /
 *  individuel) et reste modifiable avant validation.
 * ============================================================= */
function ModaleTransformation({ lead, onClose, onValide }) {
  const origineParDefaut = lead.isGroup ? "lonasante_grp" : "lonasante_ind";
  const [d, setD] = useState({
    entreprise: lead.structure || [lead.prenom, lead.nom].filter(Boolean).join(" ") || "",
    contact: [lead.prenom, lead.nom].filter(Boolean).join(" "),
    email: /@/.test(lead.contact || "") ? lead.contact : "",
    tel: !/@/.test(lead.contact || "") ? (lead.contact || "") : "",
    formationId: devinerFormation(lead),
    montant: "",
    proba: 20,
    origineId: origineParDefaut,
    origineDetail: "",
  });
  const [envoi, setEnvoi] = useState(false);
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));
  const nb = Number(lead.candidats) || 1;
  const estime = Math.round((TARIF_INDICATIF[d.formationId] || 0) * nb);

  const valider = async () => {
    setEnvoi(true);
    const ok = await onValide({
      ...d,
      montant: d.montant === "" ? estime : Number(d.montant),
      proba: Number(d.proba) || 0,
      source: (origineById(d.origineId) || {}).canal || "LONASANTE",
    });
    if (!ok) setEnvoi(false);
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Transformer en prospect</h3>
          <button className="btn btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div style={{ padding: "0 20px 4px" }}>
          <p className="faint" style={{ fontSize: 12.5, margin: "0 0 14px" }}>
            Demande n°{lead.id} · département {lead.dept} · {nb} personne{nb > 1 ? "s" : ""} ·{" "}
            {lead.isGroup ? "groupe" : "individuel"}
            {lead.formation ? ` · ${lead.formation}` : ""}
          </p>
        </div>
        <div className="modal-body"><div className="form-grid">
          <div className="field"><label>Structure</label>
            <input className="input" value={d.entreprise} onChange={(e) => set("entreprise", e.target.value)} /></div>
          <div className="field"><label>Contact</label>
            <input className="input" value={d.contact} onChange={(e) => set("contact", e.target.value)} /></div>
          <div className="field"><label>E-mail</label>
            <input className="input" value={d.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div className="field"><label>Téléphone</label>
            <input className="input" value={d.tel} onChange={(e) => set("tel", e.target.value)} /></div>
          <div className="field"><label>Formation</label>
            <select className="select" value={d.formationId} onChange={(e) => set("formationId", e.target.value)}>
              {FORMATIONS.map((f) => <option key={f.id} value={f.id}>{f.code} — {f.nom}</option>)}
            </select></div>
          <div className="field"><label>Montant estimé (€)</label>
            <input className="input num" type="number" placeholder={String(estime)} value={d.montant}
              onChange={(e) => set("montant", e.target.value)} />
            <span className="faint" style={{ fontSize: 11, marginTop: 4, display: "block" }}>
              Suggestion : {fmtE(estime)} ({nb} × tarif de référence) — à confirmer
            </span></div>
          <ChampOrigine value={d.origineId} detail={d.origineDetail}
            onChange={(id, det) => setD((x) => ({ ...x, origineId: id, origineDetail: det }))} />
          <div className="field"><label>Probabilité (%)</label>
            <input className="input num" type="number" min="0" max="100" value={d.proba}
              onChange={(e) => set("proba", e.target.value)} /></div>
        </div></div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={valider} disabled={envoi || !d.entreprise}>
            <UserPlus size={15} /> {envoi ? "Création…" : "Créer le prospect"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================= *
 *  CARTE DES DEMANDES — demandes LonaSanté (mails + webhook)
 *  Les demandes vivent côté serveur. Le bouton « Transformer en
 *  prospect » crée l'opportunité dans le pipeline CRM, sans ressaisie.
 * ============================================================= */
function CarteDemandes() {
  const [leads, setLeads] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [aTransformer, setATransformer] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [vue, setVue] = useState("aTraiter");
  const [periode, setPeriode] = useState(90);

  const charger = () => {
    setErreur(null);
    fetch("/api/leads", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setLeads)
      .catch(() => setErreur("Demandes indisponibles. Vérifiez que la relève e-mail est active."));
  };
  useEffect(charger, []);

  const transformer = async (lead, champs) => {
    try {
      const r = await fetch(`/api/leads/${lead.id}/promote`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ champs }),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        window.alert(e.error === "deja_transformee"
          ? "Cette demande a déjà été transformée en prospect."
          : "Transformation impossible. Rechargez la page et réessayez.");
        return false;
      }
      window.location.reload();
      return true;
    } catch {
      window.alert("Serveur injoignable.");
      return false;
    }
  };

  const filtres = useMemo(() => {
    if (!leads) return [];
    const q = recherche.trim().toLowerCase();
    const limite = periode ? Date.now() - periode * 864e5 : 0;
    return leads.filter((l) => {
      if (limite && new Date(l.receivedAt).getTime() < limite) return false;
      if (vue === "aTraiter" && (l.promotedProspectId || l.status !== "open")) return false;
      if (vue === "transformes" && !l.promotedProspectId) return false;
      if (!q) return true;
      return [l.structure, l.nom, l.prenom, l.dept, l.formation, l.formationShort]
        .filter(Boolean).join(" ").toLowerCase().includes(q);
    });
  }, [leads, recherche, vue, periode]);

  const recentes = leads ? leads.filter((l) => Date.now() - new Date(l.receivedAt).getTime() < 90 * 864e5) : [];
  const aTraiter = recentes.filter((l) => !l.promotedProspectId && l.status === "open").length;
  const transformes = leads ? leads.filter((l) => l.promotedProspectId).length : 0;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Carte des demandes</h1>
          <p>Demandes de formation LonaSanté reçues par e-mail et via le formulaire</p>
        </div>
        <button className="btn" onClick={charger}><RefreshCw size={15} /> Actualiser</button>
      </div>

      <div className="kpis" style={{ marginBottom: 18 }}>
        <div className="kpi">
          <div className="kpi-lbl"><MapPin size={13} /> Demandes reçues</div>
          <div className="kpi-val">{leads ? leads.length : "—"}</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl"><Bell size={13} /> À traiter (90 j)</div>
          <div className="kpi-val" style={{ color: "var(--st-quote)" }}>{leads ? aTraiter : "—"}</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl"><UserPlus size={13} /> Transformées en prospect</div>
          <div className="kpi-val" style={{ color: "var(--st-won)" }}>{leads ? transformes : "—"}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head">
          <h3>Demandes</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
            <select className="select" style={{ width: 150 }} value={periode}
              onChange={(e) => setPeriode(Number(e.target.value))}>
              <option value={30}>30 derniers jours</option>
              <option value={90}>90 derniers jours</option>
              <option value={365}>12 derniers mois</option>
              <option value={0}>Depuis l'origine</option>
            </select>
            <select className="select" style={{ width: 190 }} value={vue} onChange={(e) => setVue(e.target.value)}>
              <option value="aTraiter">À traiter</option>
              <option value="transformes">Déjà transformées</option>
              <option value="toutes">Toutes</option>
            </select>
            <input className="input" style={{ width: 200 }} placeholder="Rechercher…"
              value={recherche} onChange={(e) => setRecherche(e.target.value)} />
          </div>
        </div>

        {erreur && <p style={{ padding: "0 16px 16px", color: "var(--st-lost)", fontSize: 13 }}>{erreur}</p>}
        {!leads && !erreur && <p style={{ padding: "0 16px 16px", color: "var(--ink-3)", fontSize: 13 }}>Chargement…</p>}

        {leads && (
          <div className="scroll-x">
            <table className="table">
              <thead>
                <tr>
                  <th>Reçue le</th><th>Dép.</th><th>Structure / contact</th>
                  <th>Formation</th><th style={{ textAlign: "right" }}>Pers.</th><th>Type</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtres.length === 0 && (
                  <tr><td colSpan={7} style={{ color: "var(--ink-3)", padding: 22 }}>Aucune demande dans cette vue.</td></tr>
                )}
                {filtres.slice(0, 200).map((l) => {
                  const qui = l.structure || [l.prenom, l.nom].filter(Boolean).join(" ") || "—";
                  return (
                    <tr key={l.id}>
                      <td>{(l.receivedAt || "").slice(0, 10)}</td>
                      <td><span className="tag">{l.dept}</span></td>
                      <td style={{ fontWeight: 600 }}>{qui}</td>
                      <td>{l.formationShort || l.formation || "—"}</td>
                      <td style={{ textAlign: "right" }}>{l.candidats}</td>
                      <td><span className="tag">{l.isGroup ? "Groupe" : "Individuel"}</span></td>
                      <td style={{ textAlign: "right" }}>
                        {l.promotedProspectId
                          ? <span className="tag" style={{ color: "var(--st-won)" }}>Au pipeline</span>
                          : <button className="btn btn-sm" onClick={() => setATransformer(l)}>
                              <UserPlus size={14} /> Transformer en prospect
                            </button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {aTransformer && (
        <ModaleTransformation lead={aTransformer} onClose={() => setATransformer(null)}
          onValide={(champs) => transformer(aTransformer, champs)} />
      )}

      <div className="card">
        <div className="card-head"><h3>Répartition géographique</h3></div>
        <iframe title="Carte des demandes par département" src="/carte"
          style={{ width: "100%", height: 780, border: 0, borderRadius: 12 }} />
      </div>
    </div>
  );
}

/* ============================================================= *
 *  PLANIFICATION
 *  Trois tableaux entièrement saisissables à la main :
 *   — les formations à pourvoir (sans formateur affecté) ;
 *   — la disponibilité des formateurs ;
 *   — les sessions à confirmer, avec dates prévisionnelles.
 *  Chaque ligne se crée, se modifie et se supprime.
 * ============================================================= */

const ST_CONFIRMER = [
  { id: "a_confirmer", label: "À confirmer", color: "#ef7507" },
  { id: "option",      label: "Sous option", color: "#7a5cf0" },
  { id: "confirmee",   label: "Confirmée",   color: "#0e9aa7" },
  { id: "annulee",     label: "Annulée",     color: "#98a2b3" },
];
const ST_DISPO = [
  { id: "dispo",   label: "Disponible",      color: "#0e9aa7" },
  { id: "partiel", label: "Partiellement",   color: "#ef7507" },
  { id: "indispo", label: "Indisponible",    color: "#98a2b3" },
];
const statutById = (liste, id) => liste.find((x) => x.id === id) || liste[0];

const CH_CONFIRMER = [
  { k: "client",       label: "Client / structure",  type: "text", req: true },
  { k: "formationId",  label: "Formation",           type: "formation" },
  { k: "datePrevue",   label: "Date prévisionnelle", type: "date" },
  { k: "dateDecision", label: "Réponse attendue le", type: "date", horsTableau: true },
  { k: "dept",         label: "Dép.",                type: "text", court: true, horsTableau: true },
  { k: "nbCandidats",  label: "Appr.",               type: "number", court: true },
  { k: "montant",      label: "Montant (€)",         type: "number", horsTableau: true },
  { k: "formateur",    label: "Formateur",           type: "text" },
  { k: "statut",       label: "Statut",              type: "statut", statuts: ST_CONFIRMER },
  { k: "notes",        label: "Notes",               type: "textarea", horsTableau: true },
];
// Fusion des deux anciennes listes (formations à pourvoir + sessions à confirmer).
const fusionnerPlanification = (pourvoir, sessions) => [
  ...(pourvoir || []).map((x) => ({
    id: x.id, client: x.client || "", formationId: x.formationId || "afgsu2",
    datePrevue: x.datePrevue || "", dateDecision: "", dept: x.dept || "",
    nbCandidats: x.nbCandidats ?? "", montant: "", formateur: x.formateur || "",
    statut: x.statut === "pourvue" ? "confirmee" : "a_confirmer", notes: x.notes || "",
  })),
  ...(sessions || []).map((x) => ({
    id: x.id, client: x.client || "", formationId: x.formationId || "afgsu2",
    datePrevue: x.datePrevue || "", dateDecision: x.dateDecision || "", dept: x.dept || "",
    nbCandidats: x.nbCandidats ?? "", montant: x.montant ?? "", formateur: x.formateur || "",
    statut: x.statut || "a_confirmer", notes: x.notes || "",
  })),
];
const CH_FORMATEUR = [
  { k: "nom",         label: "Formateur",   type: "text", req: true },
  { k: "contact",     label: "Téléphone / e-mail", type: "text" },
  { k: "zone",        label: "Zone géographique",  type: "text" },
  { k: "habilitations", label: "Formations",      type: "formations" },
  { k: "du",          label: "Disponible du", type: "date" },
  { k: "au",          label: "au",            type: "date" },
  { k: "statut",      label: "Disponibilité", type: "statut", statuts: ST_DISPO },
  { k: "notes",       label: "Notes",         type: "textarea", horsTableau: true },
];

const valeurVide = (champs) => {
  const o = {};
  champs.forEach((c) => {
    o[c.k] = c.type === "formations" ? [] : c.type === "formation" ? "afgsu2"
      : c.type === "statut" ? c.statuts[0].id : c.type === "number" ? "" : "";
  });
  return o;
};

function CelluleValeur({ champ, ligne }) {
  const v = ligne[champ.k];
  if (champ.type === "formation") {
    const f = formById(v);
    return <span style={{ color: f?.color, fontWeight: 600 }}>{f?.code || "—"}</span>;
  }
  if (champ.type === "formations") {
    const ids = Array.isArray(v) ? v : [];
    if (!ids.length) return <span className="faint">—</span>;
    return (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {ids.map((id) => { const f = formById(id); return f
          ? <span key={id} className="tag" style={{ color: f.color, borderColor: f.color + "44" }}>{f.code}</span> : null; })}
      </div>
    );
  }
  if (champ.type === "statut") {
    const st = statutById(champ.statuts, v);
    return <span className="tag" style={{ color: st.color, borderColor: st.color + "44", fontWeight: 600 }}>{st.label}</span>;
  }
  if (champ.type === "date") return <span>{v ? frDate(v) : <span className="faint">—</span>}</span>;
  if (champ.type === "number") return <span className="num">{v === "" || v == null ? "—" : Number(v).toLocaleString("fr-FR")}</span>;
  return <span>{v || <span className="faint">—</span>}</span>;
}

function ModaleLigne({ titre, champs, valeur, onFermer, onValider }) {
  const [d, setD] = useState(valeur);
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));
  const manquant = champs.some((c) => c.req && !String(d[c.k] || "").trim());
  const basculer = (k, id) => {
    const cur = Array.isArray(d[k]) ? d[k] : [];
    set(k, cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  };
  return (
    <div className="modal-scrim" onClick={onFermer}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 style={{ fontSize: 17 }}>{titre}</h3>
          <button className="btn btn-icon" onClick={onFermer}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            {champs.map((c) => {
              if (c.type === "textarea") return (
                <div className="field" key={c.k} style={{ gridColumn: "1 / -1" }}>
                  <label>{c.label}</label>
                  <textarea className="input" rows={3} value={d[c.k] || ""} onChange={(e) => set(c.k, e.target.value)} />
                </div>
              );
              if (c.type === "formations") return (
                <div className="field" key={c.k} style={{ gridColumn: "1 / -1" }}>
                  <label>{c.label}</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingTop: 2 }}>
                    {FORMATIONS.map((f) => {
                      const on = (d[c.k] || []).includes(f.id);
                      return (
                        <button key={f.id} type="button" className="tag" onClick={() => basculer(c.k, f.id)}
                          style={{ cursor: "pointer", fontWeight: on ? 700 : 500,
                            color: on ? f.color : "var(--ink-3)",
                            borderColor: on ? f.color + "66" : "var(--line)",
                            background: on ? f.color + "14" : "transparent" }}>
                          {f.code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
              if (c.type === "formation") return (
                <div className="field" key={c.k}><label>{c.label}</label>
                  <select className="select" value={d[c.k] || "afgsu2"} onChange={(e) => set(c.k, e.target.value)}>
                    {FORMATIONS.map((f) => <option key={f.id} value={f.id}>{f.code} — {f.nom}</option>)}
                  </select></div>
              );
              if (c.type === "statut") return (
                <div className="field" key={c.k}><label>{c.label}</label>
                  <select className="select" value={d[c.k] || c.statuts[0].id} onChange={(e) => set(c.k, e.target.value)}>
                    {c.statuts.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
                  </select></div>
              );
              return (
                <div className="field" key={c.k}>
                  <label>{c.label}{c.req ? " *" : ""}</label>
                  <input className={`input ${c.type === "number" ? "num" : ""}`}
                    type={c.type === "date" ? "date" : c.type === "number" ? "number" : "text"}
                    value={d[c.k] ?? ""} onChange={(e) => set(c.k, e.target.value)} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onFermer}>Annuler</button>
          <button className="btn btn-primary" disabled={manquant} onClick={() => onValider(d)}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

function TableauEditable({ titre, sousTitre, icone: Icone, champs, lignes, setLignes, prefixe, nomLigne, actions, selectionId, onSelect }) {
  const [edite, setEdite] = useState(null);   // { mode: "creer" | "modifier", valeur }
  const colonnes = champs.filter((c) => !c.horsTableau);

  const enregistrer = (v) => {
    if (edite.mode === "creer") setLignes((prev) => [...(prev || []), { ...v, id: uid(prefixe) }]);
    else setLignes((prev) => prev.map((x) => (x.id === v.id ? v : x)));
    setEdite(null);
  };
  const supprimer = (l) => {
    const quoi = l.client || l.nom || "cette ligne";
    if (window.confirm(`Supprimer « ${quoi} » ? Cette action est définitive.`)) {
      setLignes((prev) => prev.filter((x) => x.id !== l.id));
    }
  };

  return (
    <div className="card" style={{ marginBottom: 18 }}>
      <div className="card-head">
        <h3><Icone size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />{titre}
          <span className="faint" style={{ fontWeight: 500 }}> · {(lignes || []).length}</span></h3>
        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          {actions}
          <button className="btn btn-primary btn-sm" onClick={() => setEdite({ mode: "creer", valeur: valeurVide(champs) })}>
            <Plus size={14} /> Ajouter
          </button>
        </div>
      </div>
      {sousTitre && <p style={{ padding: "0 16px 12px", margin: 0, color: "var(--ink-3)", fontSize: 12.5 }}>{sousTitre}</p>}

      <div className="scroll-x">
        <table className="table">
          <thead>
            <tr>
              {colonnes.map((c) => <th key={c.k} className={c.type === "number" ? "t-right" : ""}>{c.label}</th>)}
              <th style={{ width: 92 }}></th>
            </tr>
          </thead>
          <tbody>
            {(lignes || []).length === 0 && (
              <tr><td colSpan={colonnes.length + 1} style={{ padding: 22, color: "var(--ink-3)" }}>
                Aucune {nomLigne} enregistrée. Utilisez « Ajouter » pour créer la première.
              </td></tr>
            )}
            {(lignes || []).map((l) => (
              <tr key={l.id} title={l.notes || ""}
                className={`${onSelect ? "row-clic" : ""} ${selectionId === l.id ? "row-sel" : ""}`}
                onClick={onSelect ? () => onSelect(selectionId === l.id ? null : l.id) : undefined}>
                {colonnes.map((c) => (
                  <td key={c.k} className={c.type === "number" ? "t-right" : ""}>
                    <CelluleValeur champ={c} ligne={l} />
                  </td>
                ))}
                <td>
                  <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn-icon btn-sm" title="Modifier"
                      onClick={() => setEdite({ mode: "modifier", valeur: l })}><Pencil size={13} /></button>
                    <button className="btn btn-icon btn-sm" title="Supprimer"
                      style={{ color: "var(--st-lost)" }} onClick={() => supprimer(l)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edite && (
        <ModaleLigne
          titre={`${edite.mode === "creer" ? "Ajouter" : "Modifier"} — ${titre}`}
          champs={champs} valeur={edite.valeur}
          onFermer={() => setEdite(null)} onValider={enregistrer} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------- *
 *  Recherche de formateurs disponibles.
 *  Sans sélection : recherche libre. Avec une formation choisie à
 *  gauche : filtre automatiquement sur la formation et la date, et
 *  propose l'affectation en un clic.
 * ------------------------------------------------------------- */
const peutAnimer = (f, formationId) =>
  !formationId || !(f.habilitations || []).length || (f.habilitations || []).includes(formationId);
const dispoLeJour = (f, dateISO) => {
  if (f.statut === "indispo") return false;
  if (!dateISO) return true;
  if (f.du && dateISO < f.du) return false;
  if (f.au && dateISO > f.au) return false;
  return true;
};

function RechercheFormateurs({ formateurs, cible, onAffecter, onGerer }) {
  const [texte, setTexte] = useState("");
  const [formation, setFormation] = useState("");
  const [date, setDate] = useState("");
  const [seulementDispo, setSeulementDispo] = useState(true);

  // Une formation sélectionnée à gauche impose ses critères.
  const fFormation = cible ? cible.formationId : formation;
  const fDate = cible ? cible.datePrevue : date;

  const resultats = useMemo(() => {
    const q = texte.trim().toLowerCase();
    return (formateurs || [])
      .map((f) => ({
        f,
        habilite: peutAnimer(f, fFormation),
        precise: (f.habilitations || []).includes(fFormation),
        libre: dispoLeJour(f, fDate),
      }))
      .filter((r) => {
        if (seulementDispo && !r.libre) return false;
        if (fFormation && !r.habilite) return false;
        if (!q) return true;
        return [r.f.nom, r.f.zone, r.f.contact].filter(Boolean).join(" ").toLowerCase().includes(q);
      })
      .sort((a, b) => (b.precise - a.precise) || (b.libre - a.libre) || a.f.nom.localeCompare(b.f.nom));
  }, [formateurs, texte, fFormation, fDate, seulementDispo]);

  return (
    <div className="card">
      <div className="card-head">
        <h3><Users size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />
          Formateurs disponibles <span className="faint" style={{ fontWeight: 500 }}>· {resultats.length}</span></h3>
        <button className="btn btn-sm" style={{ marginLeft: "auto" }} onClick={onGerer}>
          <Settings2 size={14} /> Gérer
        </button>
      </div>

      <div style={{ padding: "0 14px 12px" }}>
        {cible ? (
          <div style={{ border: "1px solid var(--brand)44", background: "var(--brand-50)", borderRadius: 10,
            padding: "9px 11px", marginBottom: 11, fontSize: 12.5 }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{cible.client}</div>
            <div className="faint">
              {formById(cible.formationId)?.code || "—"}
              {cible.datePrevue ? ` · ${frDate(cible.datePrevue)}` : " · date à fixer"}
              {cible.dept ? ` · dép. ${cible.dept}` : ""}
            </div>
            <div style={{ marginTop: 5, color: "var(--ink-3)", fontSize: 11.5 }}>
              Liste filtrée sur cette formation. Cliquez « Affecter » pour renseigner le formateur.
            </div>
          </div>
        ) : (
          <div className="form-grid" style={{ gap: 9, marginBottom: 10 }}>
            <div className="field"><label>Formation</label>
              <select className="select" value={formation} onChange={(e) => setFormation(e.target.value)}>
                <option value="">Toutes</option>
                {FORMATIONS.map((f) => <option key={f.id} value={f.id}>{f.code}</option>)}
              </select></div>
            <div className="field"><label>Disponible le</label>
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          </div>
        )}

        <input className="input" placeholder="Nom, zone, téléphone…" value={texte}
          onChange={(e) => setTexte(e.target.value)} style={{ marginBottom: 9 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--ink-2)", cursor: "pointer" }}>
          <input type="checkbox" checked={seulementDispo} onChange={(e) => setSeulementDispo(e.target.checked)} />
          Masquer les indisponibles
        </label>
      </div>

      <div style={{ padding: "0 14px 14px", maxHeight: 620, overflowY: "auto" }}>
        {resultats.length === 0 && (
          <p style={{ color: "var(--ink-3)", fontSize: 12.5, margin: 0 }}>
            Aucun formateur ne correspond. Élargissez la recherche ou complétez les fiches via « Gérer ».
          </p>
        )}
        {resultats.map(({ f, precise, libre }) => {
          const st = statutById(ST_DISPO, f.statut);
          return (
            <div key={f.id} className={`fo-card ${precise ? "match" : ""}`}>
              <div className="fo-top">
                <span className="fo-nom">{f.nom}</span>
                <span className="tag" style={{ color: st.color, borderColor: st.color + "44" }}>{st.label}</span>
                {cible && (
                  <button className="btn btn-sm btn-primary" style={{ marginLeft: "auto" }}
                    onClick={() => onAffecter(f.nom)}>Affecter</button>
                )}
              </div>
              <div className="fo-meta">
                {f.zone ? f.zone : "Zone non renseignée"}
                {f.contact ? ` · ${f.contact}` : ""}
                <br />
                {f.du || f.au
                  ? `Disponible ${f.du ? `du ${frDate(f.du)}` : ""}${f.au ? ` au ${frDate(f.au)}` : ""}`
                  : "Période non renseignée"}
                {!libre && <span style={{ color: "var(--st-lost)" }}> — hors période</span>}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                {(f.habilitations || []).length === 0
                  ? <span className="tag" style={{ color: "var(--gold)", borderColor: "var(--gold)44" }}>habilitations à renseigner</span>
                  : (f.habilitations || []).map((id) => {
                      const fo = formById(id); if (!fo) return null;
                      return <span key={id} className="tag" style={{ color: fo.color, borderColor: fo.color + "44" }}>{fo.code}</span>;
                    })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Planification({ aConfirmer, setAConfirmer, formateurs, setFormateurs, factures }) {
  const [selection, setSelection] = useState(null);
  const [gestion, setGestion] = useState(false);

  const cible = (aConfirmer || []).find((x) => x.id === selection) || null;

  const affecter = (nom) => {
    if (!cible) return;
    setAConfirmer((prev) => prev.map((x) => (x.id === cible.id ? { ...x, formateur: nom } : x)));
  };

  const importerFormateurs = () => {
    const connus = new Set((formateurs || []).map((f) => (f.nom || "").trim().toUpperCase()));
    const trouves = [...new Set((factures || []).map((s) => (s.formateur || "").trim()).filter(Boolean))]
      .filter((nom) => !connus.has(nom.toUpperCase()));
    if (!trouves.length) { window.alert("Tous les formateurs des sessions sont déjà dans la liste."); return; }
    if (!window.confirm(`Ajouter ${trouves.length} formateur(s) relevé(s) dans les sessions ?\n\n${trouves.join(", ")}`)) return;
    setFormateurs((prev) => [...(prev || []), ...trouves.map((nom) => ({
      id: uid("fo"), nom, contact: "", zone: "", habilitations: [], du: "", au: "", statut: "dispo", notes: "",
    }))]);
  };

  const ouvertes = (aConfirmer || []).filter((x) => x.statut === "a_confirmer" || x.statut === "option");
  const sansFormateur = ouvertes.filter((x) => !String(x.formateur || "").trim()).length;
  const caEnJeu = ouvertes.reduce((a, x) => a + (Number(x.montant) || 0), 0);
  const dispos = (formateurs || []).filter((x) => x.statut === "dispo").length;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Planification</h1>
          <p>Formations à confirmer et formateurs disponibles</p>
        </div>
      </div>

      <div className="kpis" style={{ marginBottom: 18 }}>
        <div className="kpi">
          <div className="kpi-lbl"><CalendarClock size={13} /> Formations à confirmer</div>
          <div className="kpi-val">{ouvertes.length}</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl"><AlertTriangle size={13} /> Sans formateur</div>
          <div className="kpi-val" style={{ color: sansFormateur ? "var(--st-lost)" : "var(--ink)" }}>{sansFormateur}</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl"><Users size={13} /> Formateurs disponibles</div>
          <div className="kpi-val" style={{ color: "var(--st-won)" }}>
            {dispos} <span style={{ fontSize: 15, color: "var(--ink-3)" }}>/ {(formateurs || []).length}</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl"><CircleDollarSign size={13} /> Chiffre d'affaires en jeu</div>
          <div className="kpi-val num">{fmtE(caEnJeu)}</div>
        </div>
      </div>

      <div className="planif-grid">
        <TableauEditable
          titre="Formations à confirmer" icone={CalendarClock} nomLigne="formation"
          sousTitre="Cliquez une ligne pour filtrer les formateurs disponibles à droite."
          champs={CH_CONFIRMER} lignes={aConfirmer} setLignes={setAConfirmer} prefixe="ac"
          selectionId={selection} onSelect={setSelection} />

        <RechercheFormateurs
          formateurs={formateurs} cible={cible} onAffecter={affecter}
          onGerer={() => setGestion(!gestion)} />
      </div>

      {gestion && (
        <div style={{ marginTop: 4 }}>
          <TableauEditable
            titre="Fiches formateurs" icone={Users} nomLigne="fiche formateur"
            sousTitre="Zone d'intervention, formations animées et période de disponibilité."
            champs={CH_FORMATEUR} lignes={formateurs} setLignes={setFormateurs} prefixe="fo"
            actions={<button className="btn btn-sm" onClick={importerFormateurs}>
              <Download size={14} /> Reprendre ceux des sessions</button>} />
        </div>
      )}
    </div>
  );
}

const NAV = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, sub: "Pilotage commercial & financier" },
  { id: "crm",       label: "Pipeline CRM",    icon: KanbanSquare,    sub: "Prospects & opportunités" },
  { id: "acquisition", label: "Acquisition",   icon: PhoneIncoming,   sub: "Prospects décrochés & ROI" },
  { id: "clients",   label: "Clients",         icon: Building2,       sub: "Comptes & historique" },
  { id: "compta",    label: "Comptabilité",    icon: Wallet,          sub: "Recettes, créances & résultat" },
  { id: "renta",     label: "Rentabilité",     icon: TrendingUp,      sub: "Marge, formations & formateurs" },
  { id: "comparatif", label: "Comparatif N‑1",  icon: BarChart3,       sub: "Exercice en cours vs précédent" },
  { id: "planif",    label: "Planification",   icon: CalendarRange,  sub: "Formateurs, sessions & dates" },
  { id: "carte",     label: "Carte des demandes", icon: MapIcon,     sub: "Demandes LonaSanté & transformation" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [focusId, setFocusId] = useState(null);
  const [prospects, setProspects] = useState(SEED_PROSPECTS);
  const [factures, setFactures] = useState(SEED_FACTURES);
  const [depenses, setDepenses] = useState(SEED_DEPENSES);
  const [tva, setTva] = useState(0);
  const [rentaParams, setRentaParams] = useState(DEFAULT_PARAMS);
  const [aConfirmer, setAConfirmer] = useState([]);
  const [formateurs, setFormateurs] = useState([]);

  const [loaded, setLoaded] = useState(false);
  const [storageOn, setStorageOn] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved
  const hasStorage = typeof window !== "undefined" && window.storage && typeof window.storage.get === "function";

  // Chargement initial depuis le stockage persistant
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (hasStorage) {
        try {
          let r = null;
          try { r = await window.storage.get(STORE_KEY); } catch (e) { r = null; }
          if (!r) { try { r = await window.storage.get(LEGACY_STORE_KEY); } catch (e) { r = null; } }
          if (!cancelled && r && r.value) {
            const d = JSON.parse(r.value);
            const ids = [...(d.prospects || []), ...(d.factures || []), ...(d.depenses || [])].map((x) => (x && x.id) || "");
            bumpUid(ids.reduce((m, id) => { const n = parseInt(String(id).split("_").pop(), 10); return Number.isNaN(n) ? m : Math.max(m, n); }, 0));
            if (Array.isArray(d.prospects)) setProspects(migrerProspects(d.prospects));
            if (Array.isArray(d.aConfirmer)) setAConfirmer(d.aConfirmer);
            else if (Array.isArray(d.aPourvoir) || Array.isArray(d.planSessions))
              setAConfirmer(fusionnerPlanification(d.aPourvoir, d.planSessions));
            if (Array.isArray(d.formateurs)) setFormateurs(d.formateurs);
            if (Array.isArray(d.factures)) setFactures(d.factures);
            if (Array.isArray(d.depenses)) setDepenses(d.depenses);
            if (typeof d.tva === "number") setTva(d.tva);
            if (d.rentaParams && typeof d.rentaParams === "object") setRentaParams({ ...DEFAULT_PARAMS, ...d.rentaParams });
            if (!cancelled) setSaveState("saved");
          }
        } catch (e) { /* aucune sauvegarde existante → on garde les données de démonstration */ }
        if (!cancelled) setStorageOn(true);
      }
      if (!cancelled) setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  // Sauvegarde automatique (déclenchée à chaque modification, légèrement différée)
  useEffect(() => {
    if (!loaded || !storageOn) return;
    setSaveState("saving");
    const t = setTimeout(async () => {
      try {
        await window.storage.set(STORE_KEY, JSON.stringify({ v: 1, prospects, factures, depenses, tva, rentaParams, aConfirmer, formateurs }));
        setSaveState("saved");
      } catch (e) { setSaveState("idle"); }
    }, 450);
    return () => clearTimeout(t);
  }, [prospects, factures, depenses, tva, rentaParams, aConfirmer, formateurs, loaded, storageOn]);

  const resetData = async () => {
    if (typeof confirm === "function" && !confirm("Réinitialiser toutes les données ? Vos saisies seront remplacées par les données de démonstration.")) return;
    try { if (hasStorage) await window.storage.delete(STORE_KEY); } catch (e) {}
    setProspects(SEED_PROSPECTS); setFactures(SEED_FACTURES); setDepenses(SEED_DEPENSES); setTva(0); setRentaParams(DEFAULT_PARAMS);
  };

  const fileRef = useRef(null);
  const downloadBlob = (content, filename, type) => {
    try {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; document.body.appendChild(a); a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    } catch (e) { alert("Export impossible dans cet environnement."); }
  };
  const exportJSON = () => downloadBlob(JSON.stringify({ v: 1, exportedAt: new Date().toISOString(), prospects, factures, depenses, tva, rentaParams, aConfirmer, formateurs }, null, 2), `extralife-sauvegarde-${TODAY_ISO}.json`, "application/json");
  const exportCSV = () => {
    const cols = ["ref", "date", "mois", "formation", "client", "origine", "formateur", "base", "nbCand", "prixCand", "forfait", "caHT", "coutVar", "marge", "tva", "statut", "etat", "financement", "presents", "satisfaction"];
    const esc = (v) => { const s = v == null ? "" : String(v); return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const lines = [cols.join(";")];
    factures.forEach((s) => {
      const c = computeSession(s, rentaParams), fo = formById(s.formationId);
      lines.push([s.ref, s.date, s.mois, fo ? fo.code : "", s.client, s.origine, s.formateur, s.base, s.nbCand, s.prixCand, s.forfait, Math.round(c.caht), Math.round(c.coutVar), Math.round(c.mb), s.tva, (FACT_STATUTS[s.statut] || {}).label || s.statut, c.etat, s.financement, s.presents, s.satisfaction].map(esc).join(";"));
    });
    downloadBlob("\ufeff" + lines.join("\n"), `extralife-sessions-${TODAY_ISO}.csv`, "text/csv;charset=utf-8");
  };
  const importJSON = (e) => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        if (!d || (!Array.isArray(d.factures) && !Array.isArray(d.prospects))) { alert("Fichier non reconnu."); return; }
        if (!confirm("Remplacer les données actuelles par celles du fichier importé ?")) return;
        if (Array.isArray(d.prospects)) setProspects(migrerProspects(d.prospects));
        if (Array.isArray(d.aConfirmer)) setAConfirmer(d.aConfirmer);
        else if (Array.isArray(d.aPourvoir) || Array.isArray(d.planSessions))
          setAConfirmer(fusionnerPlanification(d.aPourvoir, d.planSessions));
        if (Array.isArray(d.formateurs)) setFormateurs(d.formateurs);
        if (Array.isArray(d.factures)) setFactures(d.factures);
        if (Array.isArray(d.depenses)) setDepenses(d.depenses);
        if (typeof d.tva === "number") setTva(d.tva);
        if (d.rentaParams) setRentaParams({ ...DEFAULT_PARAMS, ...d.rentaParams });
      } catch (err) { alert("Import impossible : fichier JSON invalide."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const goto = (t, id = null) => { setTab(t); setFocusId(id); };
  const current = NAV.find((n) => n.id === tab);

  if (!loaded) {
    return (
      <div className="of-root">
        <style>{STYLES}</style>
        <div className="boot"><div className="boot-card"><div className="spin" /><div style={{ fontSize: 13, fontWeight: 600 }}>Chargement de vos données…</div></div></div>
      </div>
    );
  }

  const saveBadge = !storageOn
    ? { dot: "var(--ink-3)", label: "Session locale", icon: CloudOff, title: "Stockage indisponible ici : les saisies ne seront pas conservées après fermeture." }
    : saveState === "saving"
      ? { dot: "var(--gold)", label: "Enregistrement…", icon: Cloud, title: "Sauvegarde en cours" }
      : { dot: "var(--st-won)", label: "Enregistré", icon: Cloud, title: "Données enregistrées — conservées après fermeture" };

  return (
    <div className="of-root">
      <style>{STYLES}</style>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-logo">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M17 3 C 10 9, 6.5 16, 9.5 26 C 15 20, 19 13.5, 17 3 Z" fill="#FFB600" />
                <path d="M21 5 C 14.5 11, 11 18, 13.5 27 C 19.5 21, 23.5 14.5, 21 5 Z" fill="#00B4BC" />
                <path d="M11 20 C 12 26.5, 16.5 29.5, 23 27 C 17.5 24, 14 22, 11 20 Z" fill="#E02436" />
              </svg>
            </div>
            <div>
              <div className="brand-name">ExtraLife <span style={{ color: "#FF6671" }}>Formation</span></div>
              <div className="brand-sub">Exercice 2026–2027 · protéger la vie</div>
            </div>
          </div>
          <nav className="nav">
            <div className="nav-label">Pilotage</div>
            {NAV.map((n) => (
              <button key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => goto(n.id)}>
                <n.icon size={18} />{n.label}
              </button>
            ))}
          </nav>
          <div className="side-foot">
            Organisme de formation santé & sécurité<br />
            <span style={{ color: "#8a9b9a" }}>AFGSU · MAC · SST · Incendie</span>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div>
              <h1>{current.label}</h1>
              <div className="sub">{current.sub}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="save-badge" title={saveBadge.title}>
                <span className="sdot" style={{ background: saveBadge.dot }} />
                <saveBadge.icon size={13} color="var(--ink-3)" />{saveBadge.label}
              </span>
              <button className="btn btn-icon" title="Exporter les sessions en CSV (Excel)" onClick={exportCSV}><FileSpreadsheet size={15} /></button>
              <button className="btn btn-icon" title="Sauvegarder (télécharger un fichier .json)" onClick={exportJSON}><Download size={15} /></button>
              <button className="btn btn-icon" title="Importer une sauvegarde .json" onClick={() => fileRef.current && fileRef.current.click()}><Upload size={15} /></button>
              <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: "none" }} onChange={importJSON} />
              <button className="btn btn-icon" title="Réinitialiser les données de démonstration" onClick={resetData}><RotateCcw size={15} /></button>
              <div style={{ textAlign: "right" }}>
                <div className="faint" style={{ fontSize: 11 }}>Aujourd'hui</div>
                <div className="num" style={{ fontWeight: 700, fontSize: 13 }}>{today.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--brand-50)", display: "grid", placeItems: "center", fontWeight: 700, color: "var(--brand)", fontSize: 14 }}>EF</div>
            </div>
          </header>

          <main className="content">
            {tab === "dashboard" && <Dashboard prospects={prospects} factures={factures} depenses={depenses} tva={tva} goto={goto} />}
            {tab === "crm" && <CRM prospects={prospects} setProspects={setProspects} setFactures={setFactures} focusId={focusId} clearFocus={() => setFocusId(null)} />}
            {tab === "acquisition" && <Acquisition prospects={prospects} factures={factures} params={rentaParams} setParams={setRentaParams} goto={goto} />}
            {tab === "clients" && <ClientsView factures={factures} prospects={prospects} goto={goto} />}
            {tab === "compta" && <Comptabilite factures={factures} setFactures={setFactures} depenses={depenses} setDepenses={setDepenses} tva={tva} setTva={setTva} />}
            {tab === "renta" && <Rentabilite factures={factures} setFactures={setFactures} prospects={prospects} depenses={depenses} params={rentaParams} setParams={setRentaParams} />}
            {tab === "comparatif" && <ComparatifView factures={factures} params={rentaParams} setParams={setRentaParams} />}
            {tab === "planif" && <Planification aConfirmer={aConfirmer} setAConfirmer={setAConfirmer} formateurs={formateurs} setFormateurs={setFormateurs} factures={factures} />}
            {tab === "carte" && <CarteDemandes />}
          </main>
        </div>
      </div>
    </div>
  );
}
