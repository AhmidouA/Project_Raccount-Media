const express = require("express");
const router = express.Router();

const { userController, authController, postController } = require("../controllers");

// post
router.get('/', postController.readPost);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

// like post
router.patch('/like-post/:id', postController.likePost)
router.patch('/unlike-post/:id', postController.unLikePost)



module.exports = router;