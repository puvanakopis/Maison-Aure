const mongoose = require("mongoose");

const DB_NAME = "maison_aure";
let isMongoConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI || `mongodb://localhost:27017/${DB_NAME}`;

  try {
    const conn = await mongoose.connect(uri, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 8000,
    });

    isMongoConnected = true;
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Active Database:   ${conn.connection.name || DB_NAME}`);

    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`
  ────────────────────────────────────────────────────────────
  ⚠️ MongoDB connection failed for database: '${DB_NAME}'
     URI: ${uri.replace(/\/\/.*@/, "//***:***@")}
     Reason: ${error.message}
     
  💡 Troubleshooting:
     - Verify network access and IP whitelist on MongoDB Atlas
     - Ensure MONGODB_URI in backend/.env points to cluster with /${DB_NAME}
  ────────────────────────────────────────────────────────────
    `);
    return false;
  }
}

function getIsMongoConnected() {
  return isMongoConnected && mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  getIsMongoConnected,
  DB_NAME,
};
