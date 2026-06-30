const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // SAFE CHECK: Fallback approach if profile.emails[0] is undefined
        let email = null;
        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        } else if (profile._json && profile._json.email) {
          email = profile._json.email;
        }

        // If still no email found, throw a clear error instead of crashing the server
        if (!email) {
          return done(
            new Error("No email found associated with this Google account"),
            null,
          );
        }

        // 1. Check if a user with this email already exists in the database
        let user = await User.findOne({ email: email });

        if (user) {
          // ACCOUNT LINKING TWIST: User existed via local signup, but googleId is missing
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authMethod = "both"; // Update flag to indicate linked status
            if (!user.photo && profile.photos && profile.photos.length > 0) {
              user.photo = profile.photos[0].value;
            }
            await user.save();
            console.log(
              "Google account successfully linked with existing email:",
              email,
            );
          } else {
            console.log("Existing user logged in via Google:", email);
          }
        } else {
          // 2. Fresh User: If user doesn't exist, create a brand new Google user record
          let photoUrl = "";
          if (profile.photos && profile.photos.length > 0) {
            photoUrl = profile.photos[0].value;
          }

          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            photo: photoUrl,
            authMethod: "google", // Purely Google-based user
          });
          console.log("New user registered via Google OAuth:", email);
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ), // <-- Yeh bracket aur parenthesis missing tha strategy ka
); // <-- Aur yeh parenthesis passport.use ka close kar rha hai

// Passport session serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
