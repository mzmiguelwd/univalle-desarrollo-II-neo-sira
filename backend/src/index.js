const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const app = require("./app.js");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Connect to MongoDB and start the server.
 */
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to MongoDB Atlas.");

    app.listen(PORT, () => {
      console.log(`Neo-SIRA server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas:", error.message);
    process.exit(1); // Exit process with failure
  }
};

startServer();
