// This file handles connecting to MongoDB.
// We keep it separate so server.js stays clean.

const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/learn-oauth");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // stop the app if DB connection fails
  }
}

module.exports = connectDB;
