// Model bdd
const { UserModel, PostModel } = require("../models");

// vérification ID par BD
const ObjectID = require('mongoose').Types.ObjectId

const postController = {
    async readPost (req, res) {
       const posts = await PostModel.find();
       try {
        res.status(200).json(posts);
       } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
       }       
    }, 

    async createPost (req, res) {
        const newPost = new PostModel ({
            posterId: req.body.posterId,
            message: req.body.message,
            video: req.body.video,
            likers: [], // tableau vide car on le demande en required et on le met vide au debut pour pas de pb
            comments: [] // tableau vide car on le demande en required et on le met vide au debut pour pas de pb
        })

        try {
            const post = await newPost.save()
            res.status(201).json(post);

        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message });
           }
    }, 

    async updatePost(req, res) {
        console.log("req.params", req.params);
        if (!ObjectID.isValid(req.params.id)) {
          return res.status(400).json(`ID Inconnu: ${req.params.id}`);
        }
      
        const updatedRecord = {
          message: req.body.message
        };
      
        console.log("updatedRecord Message", updatedRecord.message);
      
        try {
          const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $set: updatedRecord },
            { new: true }
          );
      
          if (!updatedPost) {
            return res.status(400).json({ message: "Erreur lors de la mise à jour du poste" });
          }
      
          res.status(200).json(updatedPost);
        } catch (err) {
          console.error("Update error : " + err);
          res.status(400).json({ message: err.message });
        }
      },
      

    async deletePost (req, res) {
        console.log("req.params", req.params);
        if (!ObjectID.isValid(req.params.id)) {
          return res.status(400).json(`ID Inconnu: ${req.params.id}`);
        }

        try {
            const deletePost = await PostModel.deleteOne({_id: req.params.id});
        
            if (!deletePost) {
              return res.status(400).json({ message: "Erreur lors de la suppression du post" });
            }
        
            res.status(200).json({message: "Supprimé avec succès"});
          } catch (err) {
            console.error("Delete error : " + err);
            res.status(400).json({ message: err.message });
          }

    }, 

};

module.exports = postController;
