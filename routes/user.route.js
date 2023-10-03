const express = require("express");
const router = express.Router();

const { userController, authController } = require("../controllers");


// auth
router.post("/signUp", authController.signUp);



// user
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);


module.exports = router;