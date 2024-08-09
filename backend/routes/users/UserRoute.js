const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/UserController");
const Auth = require("../../middleware/Auth");

router.post("/register", UserController.createUser);
router.post("/user", Auth.auth, UserController.getUser);
router.post("/login", UserController.loginUser);

module.exports = router;