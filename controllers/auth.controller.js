const { userModel } = require ('../models');
const { signUpErrors } = require('../utils/error.utils')

const authController =  {
    async signUp (req, res) {
        const { pseudo, email, password } = req.body;
        console.log({pseudo, email, password });

        try {
            const user = await userModel.create({pseudo, email, password});
            res.status(200).json({Message: 'Vous êtes inscrit', userId: user._id, userPseudo: user.pseudo})
        }
        catch (err) {
            console.error("err", err)
            const errors = signUpErrors(err);
            res.status(400).send({errors})
        }
    }, 
}

module.exports = authController;