require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

//  SAHI TARIKA: Original package ko passport naam do, aur config ko alag se require karo
const passport = require("passport");
require("./config/passport");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes.route");

const app = express();

// ---------- Connect to MongoDB ----------
connectDB();

// ---------- Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Ab yeh makkhan ki tarah chalega 🚀
app.use(passport.initialize());
app.use(passport.session());

// ---------- Routes ----------
app.use("/auth", authRoutes);

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
