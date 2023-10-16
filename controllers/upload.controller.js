const UserModel = require("../models/user.model");
const { uploadErrors } = require('../utils/error.utils');
const fs = require("fs");

const uploadController = { 
    async uploadProfil (req, res){

        if (
            // Vérifie si le type MIME du fichier ne commence pas par "image/"
            // ou si le type MIME n'est pas l'un des types d'images valides (jpeg, png, jpg)
            !req.file.mimetype.startsWith("image/") ||
            !["image/jpeg", "image/png", "image/jpg"].includes(req.file.mimetype)
        ) {
            throw Error("Format de fichier invalide");
        }
        
        // Vérifie si la taille du fichier dépasse la limite maximale de 500 000 octets (500 Ko)
        if (req.file.size > 500000) {
            throw Error("La taille du fichier dépasse la limite maximale");
        }

        // récupere le chemin de l'image uploadée
        const file = req.file.filename;
        console.log("{ picture }>>>>>>", file);
        
        try {
            const user = await UserModel.findByIdAndUpdate(
                req.body.userId,
                { $set : {picture: "./uploads/profil/" + file}},
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            console.log("user", user)

            if (!user) {
                res.status(400).json({ message: "La photo n'a pas pu être enregistrée dans la base de données" });
            }
        
            return res.status(200).json({
                user,
                message: "La photo a été enregistrée dans la base de données"
              });
        } catch (err) {
            console.error("err Picture add", err)
            return res.status(500).json({ message: err.message });
        }
    },

     // Module stream Image
     streamPicture(req, res) {
        const file = req.params.file;
        const filePath = `${__dirname}/../client/public/uploads/profil/${file}`;
        console.log("file dans stream Picture", filePath);
        fs.createReadStream(filePath).pipe(res);
      }
      
};

module.exports = uploadController;
