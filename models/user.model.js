const mongoose = require('mongoose');
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema (
    {
        pseudo: {
            type: String,
            required: true,
            minLength: 3 , // min chaine de carractére
            maxLength: 55, // max chaine de carractére
            unique: true,
            trimp : true, // trimp supprime les espaces a la fin.
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            trim: true // trimp supprime les espaces au debut.
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minLength: 6 // min chaine de carractére
        },
        bio: {
            type: String,
            maxLength: 1024,
        },
        followers: {
            type: [String] // y'aurai plusieurs Id de personne qui le suive donc un tableau
        },
        following : {
            type: [String] // y'aurai plusieurs Id de personne qui va suivre donc un tableau
        },
        likes : {
            type: [String]
        }
    },
    {
        timestamps: true,  // Pour avoir la date de l'inscription
    }
);

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;