// This file configures Passport.js — it tells Passport HOW to talk to Google
// and WHAT to do with the user's data once Google sends it back.

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
        const email = profile.email[0].value;

        // check with this email already user exist or not
        let user = await User.findOne({ email: email });

        if (user) {
          // if user find and no googleID means user first signup
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authMethod = "both";
            if (!user.photo) {
              user.photo = profile.photos[0].value;
              await user.save();

              console.log(
                " Google account successfully linked with  local email : ",
                email,
              );
            } else {
              console.log("Existing user logged in via Google:", email);
            }
          } else {
            // if user totally new
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: email,
              photo: profile.photos[0].value,
              authMethod: "google",
            });
            console.log("New Google user created : ", email);
          }
          return done(null, user);
        }
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
