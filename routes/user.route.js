const express = require("express");
const router = express.Router();

const { userController, authController } = require("../controllers");


// auth
router.post("/signUp", authController.signUp);



// user
router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUser)


module.exports = router;