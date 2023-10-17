// Model bdd
const { UserModel } = require("../models");

// vérification ID par BD
const ObjectID = require("mongoose").Types.ObjectId;

const userController = {
  async getAllUsers(req, res) {
    const users = await UserModel.find().select("-password"); // Send All with out password
    res.status(200).json(users);
  },

  async getUser(req, res) {
    console.log("req.params", req.params);
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json(`ID Inconnu: ${req.params.id}`);
    }

    try {
      const user = await UserModel.findById(req.params.id).select("-password");
      if (!user) {
        return console.log(`ID Inconnu: ${req.params.id}`);
      }
      return res.json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  },

  async updateUser(req, res) {
    console.log("req.params", req.params);
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json(`ID Inconnu: ${req.params.id}`);
    }

    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { bio: req.body.bio } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      if (!user) {
        return res.status(400).json({ message: err });
      }
      return res.status(201).json(user);
    } catch (err) {
      console.error("err", err);
      return res.status(400).json({ message: err });
    }
  },

  async deleteUser(req, res) {
    console.log("req.params", req.params);
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json(`ID Inconnu: ${req.params.id}`);
    }

    try {
      const user = await UserModel.deleteOne({ _id: req.params.id });

      if (!user) {
        return res.status(400).json({ message: err });
      }
      res.status(200).json({ message: "Supprimé avec succès" });
    } catch (err) {
      console.error("err", err);
      return res.status(400).json({ message: err });
    }
  },

  async follow(req, res) {
    console.log("req.params", req.params);
    console.log("req.body.idToFollow", req.body);

    // Vérification si l'ID de l'utilisateur existe et si l'utilisateur que vous voulez suivre existe aussi
    if (
      !ObjectID.isValid(req.params.id) ||
      !ObjectID.isValid(req.body.idToFollow)
    ) {
      return res.status(400).json({ message: "ID inconnu" });
    }

    try {
      // Ajouter l'utilisateur à la liste des following (les gens que je suis)
      const user = await UserModel.findByIdAndUpdate(req.params.id, {
        $addToSet: { following: req.body.idToFollow },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Ajouter l'utilisateur à la liste des followers (les gens qui me suivent)
      const userFollowing = await UserModel.findByIdAndUpdate(
        req.body.idToFollow,
        { $addToSet: { followers: req.params.id } }
      );

      if (!userFollowing) {
        return res.status(404).json({ message: "User to follow not found" });
      }

      res.status(200).json({
        user: user.pseudo,
        message: `Vous avez bien ajouté l'ID ${req.body.idToFollow} à vos following ${user.pseudo}`,
      });
    } catch (err) {
      console.error("err", err);
      return res.status(500).json({ message: err.message });
    }
  },

  async unfollow(req, res) {
    console.log("req.params", req.params);
    console.log("req.body.idToUnFollow", req.body);

    // Vérification si l'ID du user existe et si l'user que vous voulez unfollow existe aussi
    if (
      !ObjectID.isValid(req.params.id) ||
      !ObjectID.isValid(req.body.idToUnFollow)
    ) {
      return res.status(400).json({ message: "ID inconnu" });
    }

    try {
      // Retirer l'utilisateur de la liste des followers (les gens que je suis)
      const user = await UserModel.findByIdAndUpdate(req.params.id, {
        $pull: { following: req.body.idToUnFollow },
      });
      console.log("user", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Retirer l'utilisateur de la liste des following (les gens qui me suivent)
      const userUnFollowing = await UserModel.findByIdAndUpdate(
        req.body.idToUnFollow,
        { $pull: { following: req.params.id } }
      );
      console.log("userUnFollowing", userUnFollowing);

      res.status(200).json({
        user: user.pseudo,
        message: `Vous avez bien retiré l'ID ${req.body.idToUnFollow} de vos followers ${user.pseudo}`,
      });

      if (!userUnFollowing) {
        return res.status(404).json({ message: "User to unfollow not found" });
      }
    } catch (err) {
      console.error("err", err);
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = userController;
