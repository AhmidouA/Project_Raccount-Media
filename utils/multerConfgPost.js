const multer = require("multer");
const path = require("path");

let now = new Date()
  .toISOString()
  .slice(0, 16)
  .replace("-", "")
  .replace("-", "")
  .replace("T", "")
  .replace(/ /g, "")
  .replace(/:/g, "");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, `${__dirname}/../client/public/uploads/posts/`);
  },

  filename: function (req, file, cb) {
    if (req.body.posterId) {
      return cb(null, req.body.posterId + now + ".jpg");
    } else {
      cb(null, "randomFileName" + path.extname(file.originalname));
    }
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
