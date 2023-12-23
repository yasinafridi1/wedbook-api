const express = require("express");
const authController = require("../controllers/Auth/authController");
const router = express.Router();

router.post("/register", authController().register);
router.post("/login", authController().login);
router.get("/verify/:verifyToken", authController().verifyEmail);

module.exports = router;
