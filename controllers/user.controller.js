const { userModel } = require("../models");

// vérification ID par BD
const ObjectID = require('mongoose').Types.ObjectId


const userController = {
    async getAllUsers (req, res) {
        const users = await userModel.find().select('-password'); // Send All with out password
        res.status(200).json(users);
        
    },

    async getUser(req, res) {
        console.log("req.params", req.params);
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).json(`ID unknown: ${req.params.id}`);
        }
    
        try {
            const user = await userModel.findById(req.params.id).select('-password');
            if (!user) {
                return console.log(`ID unknown: ${req.params.id}`);
            }    
            return res.json(user);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    async updateUser (req, res) {
        console.log("req.params", req.params);
        if (!ObjectID.isValid(req.params.id)){
            return res.status(400).json(`ID unknown: ${req.params.id}`)
        };

        try {
            const user = await userModel.findOneAndUpdate({_id: req.params.id}, {$set: {bio: req.body.bio}}, 
                {new: true, upsert: true, setDefaultsOnInsert:true});

            if (!user) {
                return res.status(500).json({message: err})
            }
            return res.json(user);
            
        } catch (err) {
            return res.status(500).json({message: err})

        }

    }
};

module.exports = userController;