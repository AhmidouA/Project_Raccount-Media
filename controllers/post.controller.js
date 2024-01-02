// Model bdd
const { UserModel, PostModel } = require("../models");
const fs = require("fs");

// vérification ID par BD
const ObjectID = require("mongoose").Types.ObjectId;

const postController = {
  async readPost(req, res) {
    try {
      const posts = await PostModel.find().sort({ createdAt: -1 }); // Triez les posts du plus récent au plus ancien
      res.status(200).json({ posts });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  },

  async createPost(req, res) {
    console.log("posterId:", req.body.posterId);

    const file = req.file.filename;
    // console.log("{ picture }>>>>>>", file);
    let fileName;
    if (req.file != null) {
      if (
        !req.file.mimetype.startsWith("image/") ||
        !["image/jpeg", "image/png", "image/jpg"].includes(req.file.mimetype)
      ) {
        throw Error("Format de fichier invalide");
      }

      if (req.file.size > 500000) {
        throw Error("La taille du fichier dépasse la limite maximale");
      }

      let now = new Date()
        .toISOString()
        .slice(0, 16)
        .replace("-", "")
        .replace("-", "")
        .replace("T", "")
        .replace(/ /g, "")
        .replace(/:/g, "");
      // console.log("now", now)

      fileName = req.body.posterId + now + ".jpg";
    }
    const newPost = new PostModel({
      posterId: req.body.posterId,
      picture: req.file != null ? "./uploads/posts/" + fileName : "",
      message: req.body.message,
      video: req.body.video,
      likers: [],
      comments: [],
    });

    try {
      const post = await newPost.save();
      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  },

  async streamPicture(req, res) {
    const file = req.params.file;
    const filePath = `${__dirname}/../client/public/uploads/posts/${file}`;
    // console.log("file dans stream Picture Post.controller", filePath);
    fs.createReadStream(filePath).pipe(res);
  },

  async updatePost(req, res) {
    console.log("req.params", req.params);
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json(`ID Inconnu: ${req.params.id}`);
    }

    const updatedRecord = {
      message: req.body.message,
    };

    console.log("updatedRecord Message", updatedRecord.message);

    try {
      const updatedPost = await PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true }
      );

      if (!updatedPost) {
        return res
          .status(400)
          .json({ message: "Erreur lors de la mise à jour du poste" });
      }

      res.status(200).json(updatedPost);
    } catch (err) {
      console.error("Update error : " + err);
      res.status(400).json({ message: err.message });
    }
  },

  async deletePost(req, res) {
    console.log("req.params", req.params);
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json(`ID Inconnu: ${req.params.id}`);
    }

    try {
      const deletePost = await PostModel.deleteOne({ _id: req.params.id });

      if (!deletePost) {
        return res
          .status(400)
          .json({ message: "Erreur lors de la suppression du post" });
      }

      return res.status(200).json({ message: "Supprimé avec succès" });
    } catch (err) {
      console.error("Delete error : " + err);
      res.status(400).json({ message: err.message });
    }
  },

  async likePost(req, res) {
    console.log("req.params dans likePost", req.params);
    console.log("req.body.Likers dans likePost", req.body);
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID inconnu : " + req.params.id);
    }

    try {
      const updatedPost = await PostModel.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likers: req.body.id } },
        { new: true }
      );
      if (!updatedPost) {
        return res
          .status(400)
          .json({ message: "Erreur lors de l'ajout du likers de post" });
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.body.id,
        { $addToSet: { likes: req.params.id } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(400).json({ message: "Erreur lors du like de post" });
      }
      return res.status(201).json({ updatedUser, updatedPost });
    } catch (err) {
      console.error("Like error : " + err);
      res.status(400).json({ message: err.message });
    }
  },

  async unLikePost(req, res) {
    console.log("req.params dans unLikePost", req.params);
    console.log("req.body.idToUnLike dans unLikePost", req.body);

    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID inconnu" });
    }

    try {
      const updatedUnLikePost = await PostModel.findByIdAndUpdate(
        req.params.id,
        { $pull: { likers: req.body.id } },
        { new: true }
      );
      if (!updatedUnLikePost) {
        return res
          .status(400)
          .json({ message: "Erreur lors de l'enleve du likers de post" });
      }

      const updatedUnLikeUser = await UserModel.findByIdAndUpdate(
        req.body.id,
        { $pull: { likes: req.params.id } },
        { new: true }
      );
      if (!updatedUnLikeUser) {
        return res
          .status(400)
          .json({ message: "Erreur lors du unlike de post" });
      }
      return res.status(201).json({ updatedUnLikeUser, updatedUnLikePost });
    } catch (err) {
      console.error("unLike error : " + err);
      res.status(400).json({ message: err.message });
    }
  },

  async commentPost(req, res) {
    console.log("req.params commentPost", req.params);
    console.log("req.body commentPost", req.body);
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID inconnu" });
    }

    try {
      const commentPost = await PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            comments: {
              commenterId: req.body.commenterId,
              commenterPseudo: req.body.commenterPseudo,
              text: req.body.text,
              timestamp: new Date().getTime(), // timestamps manuelle
            },
          },
        },
        { new: true }
      );
      console.log("commentPost", commentPost);

      if (!commentPost) {
        return res.status(400).json({ message: "Erreur lors du comment post" });
      }
      return res.status(201).json(commentPost);
    } catch (err) {
      console.error("commentPost error : " + err);
      res.status(400).json({ message: err.message });
    }
  },

  async editCommentPost(req, res) {
    console.log("req.params", req.params);
    console.log("req.body", req.body);
    // Vérifiez que l'ID est valide
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);

    try {
      const post = await PostModel.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Article non trouvé" });
      }

      const theComment = post.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );

      console.log("theComment", theComment);
      if (!theComment) {
        return res.status(404).json({ message: "Commentaire non trouvé" });
      }
      theComment.text = req.body.text;

      const updatedPost = await post.save();

      return res.status(201).json(updatedPost);
    } catch (err) {
      console.error("Erreur Edit Commentaire Post: ", err);
      res.status(400).json({ message: err.message });
    }
  },

  async deleteCommentPost(req, res) {
    console.log("req.params", req.params);
    console.log("req.body", req.body);
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID inconnu" });
    }

    try {
      const deleteCommentPost = await PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            comments: {
              _id: req.body.commentId,
            },
          },
        },
        { new: true }
      );

      if (!deleteCommentPost) {
        return res.status(404).json({ message: "Commentaire Post non trouvé" });
      }

      return res
        .status(201)
        .json({
          deleteCommentPost,
          message: "le Commentaire du Post a bien été supprimé ",
        });
    } catch (err) {
      console.error("commentPost error : " + err);
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = postController;
