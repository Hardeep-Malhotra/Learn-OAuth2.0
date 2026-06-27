// This is the "Routes" file — it just maps URL paths to controller functions.
// It doesn't contain logic itself, it just connects the dots.

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// When user clicks "Login with Google" -> goes here -> redirects to Google
router.get("/google", authController.googleLogin);

// Google redirects back here after the user logs in
router.get(
  "/google/callback",
  authController.googleCallback,
  authController.loginSuccess,
);

// Frontend calls this to check if someone is logged in
router.get("/user", authController.getCurrentUser);

// Logout route
router.get("/logout", authController.logout);

module.exports = router;
