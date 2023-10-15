const UserModel = require("../models/user.model");
const { uploadErrors } = require('../utils/error.utils');

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
        
            return res.status(201).json({
                user,
                message: "La photo a été enregistrée dans la base de données"
              });
        } catch (err) {
            console.error("err Picture add", err)
            return res.status(500).json({ message: err.message });
        }
    }
};

module.exports = uploadController;
