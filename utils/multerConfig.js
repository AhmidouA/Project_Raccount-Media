
// Importer les modules nécessaires
// module pour la gestion des images
const multer = require('multer');
// module pour les chemin des ficher
const path = require('path');

// Définir l'objet de stockage pour Multer
const storage = multer.diskStorage({
  // Définir la destination pour les fichiers téléchargés
  destination: function (req, file, cb) {
    return cb(null, `${__dirname}/../client/public/uploads/profil/`);
  },
  // Définir le nom du fichier en utilisant la date actuelle et l'extension du fichier d'origine
  filename: function (req, file, cb) {
    if (req.body.name) {
      // Utilisez le nom (pseudo) du champ req.body.name comme nom de fichier
      cb(null, req.body.name + ".jpg");
    } else {
      // Si req.body.name n'est pas défini, utilisez un nom aléatoire (vous pouvez personnaliser davantage si nécessaire)
      cb(null, 'randomFileName' + path.extname(file.originalname));
    }
  }
});

// Initialiser l'objet Multer avec l'objet de stockage
const upload = multer({ storage: storage });

// Exporter l'objet Multer pour une utilisation ailleurs dans le code
module.exports = upload