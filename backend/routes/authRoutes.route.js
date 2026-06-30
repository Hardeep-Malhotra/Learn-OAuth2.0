const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Google Authentication Routes
router.get("/google", authController.googleLogin);
router.get(
  "/google/callback",
  authController.googleCallback,
  authController.loginSuccess,
);
router.get("/current_user", authController.getCurrentUser);
router.get("/logout", authController.logout);

//  Manual Form Authentication Routes
router.post("/signup", authController.manualSignup);
router.post("/login", authController.manualLogin); // <-- Manual Login Route

module.exports = router;
