const { UserModel } = require ('../models');
const { signUpErrors, signInErrors } = require('../utils/error.utils')
const jwt = require("jsonwebtoken");



// TOKEN GENERATE
const maxAge = 12 * 60 * 60 * 1000; // 12 heures en millisecondes
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
      expiresIn: maxAge,
    })
  };


const authController =  {
    async signUp (req, res) {
        const { pseudo, email, password } = req.body;
        console.log({pseudo, email, password });

        try {
            const user = await UserModel.create({pseudo, email, password});
            res.status(200).json({Message: 'Vous êtes inscrit', userId: user._id, userPseudo: user.pseudo})
        }
        catch (err) {
            console.error("err", err)
            const errors = signUpErrors(err);
            res.status(400).send({errors})
        }
    }, 

    async login (req, res) {
        const { email, password } = req.body
        console.log("{ email, password }", { email, password })

        try {
            // login vient de la methode userModel (tout en bas)
            const user = await UserModel.login(email, password);
            // console.log("user", user)
            const token = createToken(user._id)
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge})
            res.status(200).json({user: user._id})

        } catch (err) {
            console.error("err", err)
            const errors = signInErrors(err);
            res.status(400).send({errors})
        }
    },

    async logout (req, res) {
        res.cookie('jwt', '', {maxAge: 1 }) // 1miliseconde
        res.redirect('/')

    },
}

module.exports = authController;