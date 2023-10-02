const { userModel } = require("../models");

// vérification ID par BD
const ObejectID = require('mongoose').Types.ObjectId


const userController = {
    async getAllUsers (req, res) {
        const users = await userModel.find().select('-password'); // Send All with out password
        res.status(200).json(users);
        
    },

    async getUser (req, res) {
        console.log("req.params", req.params);
        if (!ObejectID.isValid(req.params.id)){
            return res.status(400).send(`ID unknown: ${req.params.id}`)
        };
        userModel.findById(req.params.id, (err, docs => {
            if (!err) {
                res.send(docs); // docs = data    
            } else {
                console.log(`ID unknown: ${req.params.id}`)
            }
        })).select('-password');
    }
};

module.exports = userController;