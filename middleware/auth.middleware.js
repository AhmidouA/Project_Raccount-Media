const jwt = require('jsonwebtoken');
const {UserModel} = require('../models');


const auth = {
    async checkUser (req, res, next) {
        const token = req.cookies.jwt;

        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async(err, decodedToken) => {
                if (err) {
                    res.locals.user = null;
                    // res.cookie('jwt', '', {maxAge: 1});
                    next();
                } else {
                    // console.log("decodedToken dans auth middleware", decodedToken)
                    let user = await UserModel.findById(decodedToken.id);
                    res.locals.user = user;
                    // console.log("res.locals.user dans auth middleware", res.locals.user);
                    next();
                }
            })
        } else {
            res.locals.user = null;
            next();
        }
    },

    async requireAuth (req, res, next) {
        const token = req.cookies.jwt;

        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async(err, decodedToken) => {
                if (err) {
                    console.log("err requireAuth", err)
                } else {
                    console.log("decodedToken requireAuth", decodedToken)
                    next();
                }
            })
        } else {
            console.log("Not Token in requireAuth")
        }
    }
};

module.exports = auth;