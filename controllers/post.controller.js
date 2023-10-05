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
        
            return res.status(200).json({message: "Supprimé avec succès"});
          } catch (err) {
            console.error("Delete error : " + err);
            res.status(400).json({ message: err.message });
          }
    },

    async likePost  (req, res)  {
        console.log("req.params", req.params);
        console.log("req.body", req.body);
        if (!ObjectID.isValid(req.params.id)) {
          return res.status(400).send("ID inconnu : " + req.params.id);
        }
      
        try {
          const updatedPost = await PostModel.findByIdAndUpdate(req.params.id,{$addToSet: { likers: req.body.id }},{ new: true });
          if (!updatedPost) {
            return res.status(400).json({message: "Erreur lors de l'ajout du likers de post"});
          }
      
          const updatedUser = await UserModel.findByIdAndUpdate(req.body.id,{$addToSet: { likes: req.params.id }},{ new: true });
          if (!updatedUser) {
            return res.status(400).json({message: "Erreur lors du like de post"});
          }
          return res.status(201).json({updatedUser, updatedPost}); // Vous pouvez choisir de renvoyer updatedPost ou updatedUser, selon vos besoins.
      
        } catch (err) {
            console.error("Delete error : " + err);
            res.status(400).json({ message: err.message });
        }
      },
      

    async unLikePost (req, res) {
        console.log("req.params", req.params);
        console.log("req.body.idToLike", req.body);
    
        // Vérification si l'ID de l'utilisateur existe et si l'utilisateur que vous voulez suivre existe aussi
        if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToLike)) {
            return res.status(400).json({ message: 'ID inconnu' });
        }
    },

};

module.exports = postController;
