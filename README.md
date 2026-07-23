# ExtraLife Formation — plateforme de pilotage unifiée

Une seule application, une seule base de données, une seule URL.

Elle réunit ce qui vivait auparavant dans deux projets séparés :

- le **pilotage commercial et financier** (tableau de bord, pipeline CRM, acquisition, clients, comptabilité, rentabilité, comparatif N‑1) ;
- les **demandes de formation LonaSanté** (relève automatique de Gmail, webhook du formulaire, carte de France par département) ;
- la **transformation d'une demande en prospect** du pipeline, sans ressaisie.

Les données ne sont plus stockées dans le navigateur : elles vivent sur le serveur, avec **comptes séparés** pour chaque membre de l'équipe.

---

## 1. Ce qui a changé

| Avant | Maintenant |
|---|---|
| Données de pilotage dans le `localStorage` du navigateur | Base SQLite serveur, accessible depuis n'importe quel poste |
| Sauvegarde manuelle par fichier JSON | Historique automatique des 60 dernières versions, restaurable |
| URL publique, sans mot de passe | Connexion obligatoire, trois niveaux de droits |
| Deux applications, deux URL | Une seule application, la carte en onglet intégré |
| Un lead LonaSanté ressaisi à la main dans le CRM | Bouton **« Transformer en prospect »** |
| Code source désynchronisé du site en ligne | Le code de ce dépôt produit exactement le site en ligne |

> **Point de vigilance.** Le dossier `extralife-formation` que vous m'avez transmis était **plus ancien que le site en ligne** : l'onglet « Carte des demandes » n'existait que dans la version compilée. Il a été réécrit dans `src/App.jsx`, et il figure cette fois dans le code source.

---

## 2. Niveaux de droits

| Rôle | Consultation | Saisie et modification | Gestion des comptes |
|---|---|---|---|
| `admin` | oui | oui | oui |
| `editeur` | oui | oui | non |
| `lecteur` | oui | non | non |

Le rôle se choisit à la création du compte, via le bouton portant votre nom en bas à droite de l'application → *Nouveau compte*.

---

## 3. Déploiement sur Railway

Vous pouvez réutiliser le service Railway existant : le point d'entrée (`node server.js`) et le disque `/data` sont inchangés.

### A. Envoyer le code sur GitHub

Depuis le dossier décompressé :

```bash
git init
git add .
git commit -m "Plateforme unifiée ExtraLife Formation"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/extralife-pilotage.git
git push -u origin main
```

### B. Variables d'environnement (onglet *Variables*)

Indispensables :

```
DB_PATH        = /data/extralife.db
NODE_ENV       = production
ADMIN_EMAIL    = votre.adresse@extralife-formation.fr
ADMIN_NOM      = Mathilde Doudard
ADMIN_PASSWORD = un mot de passe long, utilisé une seule fois
```

Relève Gmail, identique à avant :

```
INGEST_IN_PROCESS   = true
IMAP_HOST           = imap.gmail.com
IMAP_USER           = adresse-qui-recoit-les-demandes@gmail.com
IMAP_PASS           = mot de passe d'application (16 caractères)
IMAP_SUBJECT_FILTER = DEVIS SANTE FORMATION
```

### C. Disque persistant

*Settings → Volumes → New Volume*, point de montage **`/data`**. Sans cela, chaque redéploiement efface les données.

### D. Premier démarrage

Au premier lancement, le serveur crée automatiquement :

1. le compte administrateur défini par `ADMIN_EMAIL` / `ADMIN_PASSWORD` ;
2. l'historique des 639 demandes (`seed.json`) ;
3. l'état de pilotage issu de votre sauvegarde du 20 juillet — **27 prospects, 145 factures, 63 dépenses** (`seed-state.json`), soit la sauvegarde du 20 juillet 09h04.

Connectez-vous, **changez immédiatement le mot de passe administrateur**, puis supprimez la variable `ADMIN_PASSWORD`.

### E. Créer les comptes de l'équipe

Bouton portant votre nom, en bas à droite → *Nouveau compte*. Chaque personne change son mot de passe à la première connexion.

---

## 4. Utilisation en local

Prérequis : **Node.js 22 ou plus récent** (la base SQLite intégrée à Node en dépend).

```bash
npm install
cp .env.example .env        # renseigner ADMIN_EMAIL / ADMIN_PASSWORD
npm run build               # compile l'interface dans dist/
npm start                   # http://localhost:3000
```

Pour développer l'interface avec rechargement automatique, dans deux terminaux :

```bash
npm run dev:api     # serveur Node sur le port 3000
npm run dev:front   # interface Vite sur le port 5173, appels /api redirigés
```

Créer ou réinitialiser un administrateur en ligne de commande :

```bash
node creer-admin.js mathilde@exemple.fr "Mathilde Doudard" nouveau_mot_de_passe
```

---

## 5. Travail à plusieurs : comment les conflits sont gérés

L'état de pilotage est enregistré en un bloc, associé à un **numéro de version**. À chaque enregistrement, l'application transmet la version qu'elle croit être la plus récente.

- Si personne n'a modifié les données entre-temps, l'enregistrement passe et la version augmente.
- Si quelqu'un a enregistré avant vous, le serveur **refuse** l'écriture et un bandeau rouge apparaît : *« Vos dernières modifications n'ont pas été enregistrées »*. Vous rechargez, puis ressaisissez.
- Toutes les 45 secondes, l'application vérifie discrètement si la version du serveur a changé et affiche un bandeau orange le cas échéant.

**Ce que cela implique concrètement.** Deux personnes qui saisissent en même temps dans des onglets différents sont protégées contre l'écrasement silencieux, mais la seconde devra recommencer sa saisie. C'est acceptable à trois ou quatre personnes qui ne travaillent pas sur les mêmes lignes au même instant. Si vous passez à une saisie réellement simultanée et intensive, il faudra découper l'état en tables distinctes — une ligne par prospect, une par facture. C'est un chantier séparé, signalé au point 8.

---

## 6. Origine du lead

Toute opportunité porte une **origine**, choisie dans un référentiel unique :

| Origine | Canal utilisé pour la rentabilité |
|---|---|
| Lonasanté individuel | LONASANTE |
| Lonasanté groupe | LONASANTE |
| Adwords individuel | ADWORDS |
| Adwords groupe | ADWORDS |
| Partenaire | PARTENAIRE |
| Laboform | LABOFORM |
| Client récurent + champ **« Lequel ? »** | CLIENT RECURENT |

L'origine se saisit à trois endroits : à la création d'un prospect, dans sa fiche, et au moment de transformer une demande LonaSanté. Le canal en découle automatiquement, ce qui garantit que les analyses par canal (onglets Acquisition et Rentabilité) restent cohérentes même si le référentiel évolue.

Le pipeline CRM affiche l'origine sur chaque carte, propose un filtre par origine, et signale en haut de page le nombre de prospects dont l'origine n'est pas renseignée — un clic sur ce compteur isole les fiches concernées.

> **À faire au premier démarrage.** Vos 27 prospects existants sont tous en « origine à préciser ». Leurs anciennes valeurs (`Site web`, `Recommandation`, `LONASANTE`, `ADWORDS`) n'ont pas d'équivalent exact dans le nouveau référentiel : « Site web » et « Recommandation » n'y figurent pas, et pour LonaSanté comme pour Adwords il faut trancher entre individuel et groupe. Plutôt que de deviner, l'application les laisse vides et vous les signale. Comptez quelques minutes pour les qualifier.

---

## 7. Transformer une demande en prospect

Deux points d'entrée, l'un et l'autre reliés à la même API :

1. **Onglet Carte des demandes** → tableau → bouton **« Transformer en prospect »**. Une fenêtre s'ouvre pour vérifier la structure, le contact, la formation, le montant et **l'origine** avant validation.
2. **Tableau LonaSanté** (vue *Tableau* de la carte) → colonne **Pipeline CRM** → bouton **« → Prospect »**. Transformation directe, l'origine étant déduite de la demande.

Dans les deux cas, l'origine est pré-remplie d'après la demande : **Lonasanté groupe** au-dessus de 4 apprenants, **Lonasanté individuel** en dessous. Elle reste modifiable — c'est là que vous basculez sur *Client récurent* et renseignez *Lequel ?*.

Le prospect est créé à l'étape *Nouveau*, avec la structure et le contact issus du mail, la formation déduite du libellé, un **montant indicatif** (tarif de référence × nombre de personnes) **à confirmer systématiquement**, et une note rappelant le numéro de la demande d'origine.

La demande est ensuite marquée comme traitée : elle disparaît de la vue « À traiter » et affiche « Au pipeline » dans le tableau LonaSanté.

Tarifs de référence utilisés, modifiables dans `routes-app.js` (constante `TARIF_INDICATIF`) :
AFGSU 2 · 480 € — AFGSU 1 · 300 € — MAC · 180 € — MAC SST · 90 € — SST initial · 180 € — Incendie · 90 €.

Par défaut, le tableau n'affiche que les demandes des **90 derniers jours** : les 639 demandes historiques de 2025 ne remontent pas comme du travail en attente. Le sélecteur de période permet de remonter plus loin.

---

## 8. Relances du pipeline

Les prospects aux étapes **Nouveau** et **Devis en cours** déclenchent une alerte à **J+3, J+9, J+15 puis J+30** après leur dernière relance — à défaut, après leur date de décrochage.

Un panneau *Relances* s'affiche en haut du Pipeline CRM : une ligne par prospect concerné, triée du plus ancien au plus récent, avec le palier atteint, le montant, l'origine et le nombre de jours écoulés. Les compteurs par palier servent de filtres.

Trois actions sont disponibles directement sur la ligne, sans ouvrir la fiche :

- **Relancé** — enregistre une relance à la date du jour ; le prospect sort de la liste jusqu'au palier suivant ;
- **Gagné** — passe l'étape à *Gagné* et la probabilité à 100 % ;
- **Perdu** — passe l'étape à *Perdu*, probabilité à 0 %, et propose de saisir la cause du refus.

Les prospects *Devrait signer*, *Gagné*, *Perdu* et *Non pertinent* ne déclenchent aucune alerte.

---

## 9. Planification

L'onglet réunit deux blocs côte à côte.

**Formations à confirmer** (à gauche) — une seule liste pour tout ce qui n'est pas encore acté : client, formation, date prévisionnelle, date de réponse attendue, département, nombre d'apprenants, montant, formateur et statut (*À confirmer*, *Sous option*, *Confirmée*, *Annulée*). Boutons **Ajouter**, **Modifier** (crayon) et **Supprimer** (corbeille).

**Formateurs disponibles** (à droite) — la recherche rapide. Sans sélection, vous filtrez librement par formation, par date de disponibilité, ou en tapant un nom, une zone ou un téléphone. Chaque fiche affiche la zone d'intervention, les coordonnées, la période de disponibilité et les formations animées.

**Le lien entre les deux.** Cliquez une ligne de gauche : la liste de droite se filtre automatiquement sur la formation concernée et sur la date prévue, les formateurs habilités remontent en tête, et un bouton **Affecter** renseigne le nom en un clic. Un second clic sur la ligne annule la sélection.

Quatre indicateurs en haut de page : formations à confirmer, formations sans formateur, formateurs disponibles et chiffre d'affaires en jeu.

Le bouton **Gérer** ouvre les fiches formateurs en édition complète. La liste est **pré-remplie avec les 31 formateurs relevés dans vos sessions facturées**, avec les formations que chacun a déjà animées ; coordonnées et périodes de disponibilité restent à compléter — c'est ce qui rend la recherche par date pertinente. Un bouton *Reprendre ceux des sessions* rattrape les formateurs apparus depuis.

Ces données sont enregistrées dans l'état partagé, avec les mêmes règles de synchronisation, d'historique et d'export que le reste.

---

## 10. Digiforma

La plateforme se connecte à l'API GraphQL de Digiforma **en lecture seule**. Aucune écriture n'est jamais envoyée à Digiforma.

### Activer la connexion

1. Vérifiez que votre abonnement Digiforma inclut l'option API GraphQL (page des options avancées de votre compte).
2. Dans Digiforma : Paramètres → Interconnexions → GraphQL → *Générer un token*.
3. Sur le serveur, renseignez la variable `DIGIFORMA_TOKEN` avec ce token, puis redéployez.
4. Ouvrez `/api/digiforma/diagnostic` en tant qu'administrateur : la page confirme la connexion, liste les champs réellement disponibles et affiche un aperçu de trois sessions.

### Ce qui remonte

Par session : date, programme, client, formateur, apprenants, **capacité**, **durée**, CA HT, encaissements, coûts, coût formateur, **satisfaction**, état, lieu.

Ce qui ne remonte jamais : l'**origine du lead** (Lonasanté, Adwords, Laboform, client récurent). Cette classification est la vôtre, Digiforma ne la connaît pas. Le pipeline CRM et la planification restent également locaux.

### Le principe : signaler, jamais écraser

L'onglet **Digiforma** compare les deux systèmes et présente trois vues :

- **Écarts** — sessions présentes des deux côtés. Pour chacune, les champs qui diffèrent, avec la valeur de la plateforme et celle de Digiforma. Deux natures : *à récupérer* (absent chez vous, présent dans Digiforma) et *divergent* (les deux ont une valeur, elles ne concordent pas).
- **À importer** — sessions présentes dans Digiforma sans équivalent ici.
- **Hors Digiforma** — vos sessions sans correspondance trouvée.

Rien n'est repris automatiquement. Vous cochez les champs voulus, puis validez. Le bouton *Cocher les champs manquants* sélectionne d'un coup tout ce qui est absent chez vous — c'est le geste le plus utile au premier usage.

Seuls neuf champs sont reprenables : CA HT, coût direct, coût formateur, apprenants, capacité, durée, satisfaction, formateur, client. Toute autre clé envoyée au serveur est ignorée.

### Comment le rapprochement fonctionne

Une session locale et une session Digiforma sont rapprochées sur un score combinant l'écart de dates (dominant, au-delà de 10 jours aucun rapprochement), la similitude du nom de client, le formateur et le montant. Au-dessus de 70 points le rapprochement est *sûr* ; entre 45 et 70 il est proposé *à confirmer* et affiché comme tel.

Si beaucoup de vos sessions apparaissent dans *Hors Digiforma*, c'est en général que le nom du client diffère entre les deux systèmes. Le rapprochement tolère les variantes courantes (majuscules, accents, formes juridiques, mots vides) mais pas deux dénominations réellement différentes.

### Limites connues

**Pas de temps réel.** L'API Digiforma n'expose ni webhooks ni subscriptions. La synchronisation est manuelle, par le bouton *Synchroniser*.

**Le connecteur découvre le schéma.** Avant chaque récupération, il interroge Digiforma par introspection pour savoir quels champs existent, puis construit sa requête avec ces seuls champs. Si Digiforma fait évoluer son modèle, la synchronisation se dégrade au lieu de casser — un champ disparu cesse simplement de remonter.

**La capacité dépend de votre saisie Digiforma.** Elle provient des « Limites d'effectif » du programme. Si cette case n'est pas cochée dans Digiforma, la capacité ne remontera pas et vos taux de remplissage resteront vides.

---

## 11. Sauvegardes

- **Automatique** : chaque enregistrement archive une version complète, 60 conservées. Un administrateur peut consulter `/api/state/history` et restaurer par `/api/state/restore/<id>`.
- **Manuelle** : les boutons *Exporter / Importer JSON* de l'application restent disponibles. Gardez l'habitude d'un export mensuel hors ligne.
- **Base complète** : sur Railway, le volume `/data` contient `extralife.db`. Téléchargez-le périodiquement.

---

## 12. Ce qui reste à faire

Trois points relevés lors de la reprise, à traiter quand vous le souhaiterez :

1. **Les 145 factures sont toutes au statut « payé »** dans la sauvegarde. Le suivi des créances est donc inexploitable tant que les statuts réels — émise, en attente, en retard — ne sont pas saisis.
2. **Une facture n'a pas de formation rattachée** (client `CDEF 44`, 15 septembre, 400 €), ce qui la sort des analyses de rentabilité par type de formation.
3. **Saisie simultanée intensive** : voir le point 5. Le passage à une table par entité est le chantier suivant si le besoin apparaît.
4. **Doublon dans les formateurs** : `KANTE` et `KANTÉ` figurent tous deux dans vos sessions. S'il s'agit de la même personne, supprimez l'une des deux fiches dans l'onglet Planification.

### Correction apportée à une anomalie préexistante

La date du jour était **figée au 18 juin 2026** à trois endroits du code d'origine. L'application datait donc tous ses calculs de cette journée, quel que soit le jour réel : les sessions tenues depuis restaient comptées « à venir » plutôt que « réalisées », l'ancienneté des factures était sous-évaluée d'autant, et aucune relance ne se déclenchait au bon moment. La date est désormais calculée au chargement de l'application. Vos totaux de chiffre d'affaires et de pipeline sont inchangés ; c'est la répartition entre réalisé et à venir qui se corrige.

---

## 13. Contenu du dépôt

```
extralife-pilotage/
├── server.js           serveur unique : interface, API, carte, relève e-mail
├── routes-app.js       authentification, état partagé, transformation des leads
├── db.js               demandes LonaSanté (SQLite)
├── db-app.js           comptes, sessions, état de pilotage, historique
├── parse.js            normalisation d'une demande (code postal → département)
├── ingest-email.js     relève Gmail par IMAP
├── imap-test.js        page de diagnostic Gmail (administrateurs)
├── import-xlsx.js      import manuel d'un fichier Excel
├── creer-admin.js      création d'un administrateur en ligne de commande
├── seed.json           639 demandes historiques
├── seed-state.json     sauvegarde du 20 juillet : prospects, factures, dépenses
├── public-carte/       carte de France interactive
├── digiforma.js        connecteur GraphQL Digiforma (lecture seule)
├── reconcile.js        rapprochement plateforme / Digiforma
├── routes-digiforma.js routes de synchronisation et de reprise
├── src/
│   ├── App.jsx         application de pilotage, 10 onglets
│   ├── Auth.jsx        connexion, bandeaux de synchronisation, comptes
│   ├── main.jsx        point d'entrée
│   └── storage-server.js  persistance serveur, remplace le localStorage
├── dist/               interface compilée, générée par npm run build
├── railway.json        configuration de déploiement
└── .env.example        modèle de variables d'environnement
```
