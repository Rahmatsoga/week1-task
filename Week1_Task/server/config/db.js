const mongoose = require("mongoose");

/**
 * Establishes a connection to MongoDB using the URI supplied via
 * environment variables. Exits the process on failure so that
 * misconfiguration is caught immediately rather than failing silently
 * on the first request.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not defined. Check your .env file.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
