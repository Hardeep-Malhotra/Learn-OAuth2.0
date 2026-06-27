// This is the MAIN file — it just sets up the app and connects everything.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes.route");

const app = express();

// ---------- Connect to MongoDB ----------
connectDB();

// ---------- Middleware ----------
app.use(
  cors({
    origin: "http://localhost:5173", // React (Vite) frontend
    credentials: true,
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// ---------- Routes ----------
app.use("/auth", authRoutes);

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
