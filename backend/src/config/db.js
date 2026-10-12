const mongoose = require("mongoose");

const DB_NAME = "maison_aure";
let isMongoConnected = false;

// Attach persistent connection listeners for cloud deployment resiliency
mongoose.connection.on("connected", () => {
  isMongoConnected = true;
  console.log("✓ MongoDB connection active.");
});

mongoose.connection.on("disconnected", () => {
  isMongoConnected = false;
  console.warn("⚠️ MongoDB connection disconnected. Retrying automatically...");
});

mongoose.connection.on("error", (err) => {
  isMongoConnected = false;
  console.error("⚠️ MongoDB connection error:", err.message);
});

async function connectDB() {
  // If already connected (e.g. serverless warm container reuse), skip reconnecting
  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return true;
  }

  const uri = process.env.MONGODB_URI || `mongodb://localhost:27017/${DB_NAME}`;

  try {
    const conn = await mongoose.connect(uri, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000,
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
     - Verify network access and IP whitelist on MongoDB Atlas (allow 0.0.0.0/0 for cloud hosts)
     - Ensure MONGODB_URI points to valid cluster with /${DB_NAME}
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
