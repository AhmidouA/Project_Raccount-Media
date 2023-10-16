const express = require("express");
const router = express.Router();
// const multer = require("multer");
const upload = require('../utils/multerConfigProfil');

const { userController, authController, uploadController } = require("../controllers");


// auth
router.post('/signUp', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);



// user
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
// put c'est pour changer completement une donnée (un champs)
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
// patch c'est pour changer partiellement et non tout (ex: pour un tableau)
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

//uplaod
router.post('/upload', upload.single('file'), uploadController.uploadProfil);
router.get('/upload/picture/:file', uploadController.streamPicture);



module.exports = router;