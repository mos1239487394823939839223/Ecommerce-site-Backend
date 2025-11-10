const mongoose = require("mongoose");

/**
 * Safe DB connection helper.
 * - If DB_URI is not set, it logs a warning and returns without throwing.
 * - If connection fails, the error is logged and rethrown so callers can decide how to handle it.
 */
const dbConnection = async () => {
  const uri = process.env.DB_URI;
  if (!uri) {
    console.warn("DB_URI is not set. Skipping MongoDB connection.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`Database Connected : ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    // rethrow so callers (like a long-running server) can handle shutdown if desired
    throw err;
  }
};

module.exports = dbConnection;
