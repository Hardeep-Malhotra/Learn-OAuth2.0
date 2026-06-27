// This is the "Controller" — it contains the actual logic for each action.
// Routes will call these functions when a request comes in.

const passport = require("passport");

// Step 1: Redirect user to Google's login page
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Step 2: Handle Google's response after login
const googleCallback = passport.authenticate("google", {
  failureRedirect: "http://localhost:5173/login-failed",
});

// Step 2b: What happens after a SUCCESSFUL login
function loginSuccess(req, res) {
  // At this point, req.user is set by Passport (login worked)
  res.redirect("http://localhost:5173/dashboard");
}

// Step 3: Check if a user is currently logged in (frontend calls this)
function getCurrentUser(req, res) {
  if (req.user) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
}

// Step 4: Log the user out
function logout(req, res) {
  req.logout(() => {
    res.redirect("http://localhost:5173");
  });
}

module.exports = {
  googleLogin,
  googleCallback,
  loginSuccess,
  getCurrentUser,
  logout,
};
