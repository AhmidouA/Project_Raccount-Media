
// Importer les modules nécessaires
// module pour la gestion des images
const multer = require('multer');
// module pour les chemin des ficher
const path = require('path');

// change la date de miliseconde en mode date + heure + minute
let now = new Date().toISOString().slice(0, 16).replace("-", "").replace("-", "").replace("T", "").replace(/ /g, '').replace(/:/g, '');

// Définir l'objet de stockage pour Multer
const storage = multer.diskStorage({


  // Définir la destination pour les fichiers téléchargés
  destination: function (req, file, cb) {
    return cb(null, `${__dirname}/../client/public/uploads/posts/`);
  },
  // Définir le nom du fichier en utilisant la date actuelle et l'extension du fichier d'origine
  filename: function (req, file, cb) {
    if (req.body.posterId) {
      // Si now est inférieur à 10, arrondir à 10
      if (parseInt(now) < 10) {
        now = '10';
      } else {
        now = Math.ceil(parseInt(now) / 10) * 10;
      }
      // Utilisez le nom (pseudo) du champ req.body.name comme nom de fichier
      return cb(null, req.body.posterId + now + ".jpg");
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