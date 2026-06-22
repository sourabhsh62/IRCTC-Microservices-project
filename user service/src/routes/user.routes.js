const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware=require("../middlewares/auth.middleware")
router.post("/signup", userController.signup);
router.post("/Login",userController.Login);
router.get("/profile",authMiddleware,userController.profile);
router.post("/refresh-token",userController.refreshToken)

router.get("/users/:id",userController.getUserById)

module.exports = router;