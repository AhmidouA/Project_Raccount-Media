const express = require("express");
const router = express.Router();

const { userController, authController, postController } = require("../controllers");

router.get('/', postController.readPost);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);



module.exports = router;