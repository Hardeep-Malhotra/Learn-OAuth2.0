const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Import User model to interact with MongoDB

// ==========================================
//        GOOGLE AUTH FUNCTIONS
// ==========================================

// Step 1: Redirect the user to Google's OAuth login page
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Step 2: Handle the callback from Google after user authentication
const googleCallback = passport.authenticate("google", {
  failureRedirect: "http://localhost:5173/login-failed",
});

// Step 2b: Redirect user to Frontend Dashboard upon successful Google login
function loginSuccess(req, res) {
  res.redirect("http://localhost:5173/dashboard");
}

// Step 3: Check session status and return logged-in user data to Frontend
function getCurrentUser(req, res) {
  if (req.user) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
}

// Step 4: Terminate the user session and clear cookies
function logout(req, res) {
  req.logout(() => {
    res.redirect("http://localhost:5173");
  });
}

// ==========================================
//     MANUAL AUTH & ACCOUNT LINKING
// ==========================================

// Handle manual Form Signup and Account Linking (Sir's Twist)
async function manualSignup(req, res) {
  const { name, email, password } = req.body;

  try {
    // Check if a user with this email already exists in the database
    let user = await User.findOne({ email });

    if (user) {
      // ACCOUNT LINKING TWIST: User previously signed up via Google (no password)
      // and is now setting up a manual password using the same email.
      if (user.authMethod === "google" && !user.password) {
        const hashPassword = await bcrypt.hash(password, 10);

        user.password = hashPassword;
        user.authMethod = "both"; // Update flag to indicate account is linked
        await user.save();

        return res.json({
          success: true,
          message:
            "Your Google account already existed. Password has been linked successfully! Now you can login both ways.",
        });
      } else {
        // If the account already exists with a password
        return res.status(400).json({
          message: "This account already exists. Please login.",
        });
      }
    }

    // --- NEW USER REGISTRATION ---
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a brand new local user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      authMethod: "local", // Set flag to local for manual form users
    });

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 🔥 ADDED: Handle manual Form Login
async function manualLogin(req, res) {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found. Please signup first." });
    }

    // Edge Case: If user exists via Google but hasn't linked a password yet
    if (user.authMethod === "google" && !user.password) {
      return res.status(400).json({
        message:
          "You originally signed up using Google. Please use the Signup form to set/link a password first.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password credentials!" });
    }

    // Establish a Passport session (Creates the session cookie automatically)
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({
        success: true,
        message: "Logged in successfully!",
        user,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Export all controller functions to be used by the routes file
module.exports = {
  googleLogin,
  googleCallback,
  loginSuccess,
  getCurrentUser,
  logout,
  manualSignup,
  manualLogin,
};
