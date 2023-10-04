const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

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
        picture : {
            type: String,
            default: "./uploads/profil/random-user.png",
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

// Function avant de save dans la bdd tu me crypter le mot de passe
// pour utiliser le this on ne peut pas faire une fonction fléché (()=>)
userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email')
  };

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;