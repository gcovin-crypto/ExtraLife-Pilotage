// creer-admin.js — crée ou réinitialise un compte administrateur en ligne de commande.
//   node creer-admin.js mathilde@exemple.fr "Mathilde Doudard" motdepasse
require('dotenv').config();
const A = require('./db-app');

const [email, nom, motdepasse] = process.argv.slice(2);
if (!email || !motdepasse) {
  console.log('Usage : node creer-admin.js <email> "<Nom complet>" <mot de passe>');
  process.exit(1);
}
if (String(motdepasse).length < 8) { console.error('Mot de passe : 8 caractères minimum.'); process.exit(1); }

const existant = A.findUserByEmail(email);
if (existant) {
  A.setPassword(existant.id, motdepasse);
  A.updateUser(existant.id, { nom: nom || existant.nom, role: 'admin', actif: 1 });
  console.log(`Compte mis à jour : ${email} (administrateur).`);
} else {
  A.createUser({ email, nom: nom || email, password: motdepasse, role: 'admin' });
  console.log(`Compte administrateur créé : ${email}`);
}
