const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, `${__dirname}/../client/public/uploads/profil/`);
  },

  filename: function (req, file, cb) {
    if (req.body.name) {
      cb(null, req.body.name + ".jpg");
    } else {
      cb(null, "randomFileName" + path.extname(file.originalname));
    }
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
