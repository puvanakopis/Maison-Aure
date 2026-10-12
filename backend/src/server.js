require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const itemsRoutes = require("./routes/itemsRoutes");
const reservationsRoutes = require("./routes/reservationsRoutes");
const { connectDB, getIsMongoConnected, DB_NAME } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB on startup
connectDB();

// Dynamic CORS configuration for local and cloud environments (Vercel, Render, Railway, etc.)
const parseAllowedOrigins = () => {
  const envOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((o) => o.trim().replace(/\/+$/, ""))
    : [];
  return Array.from(new Set([...envOrigins, "http://localhost:3000", "http://127.0.0.1:3000"]));
};

const allowedOrigins = parseAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, uptime pingers)
      if (!origin) return callback(null, true);

      // In non-production or if wildcard origin is explicitly requested
      if (process.env.NODE_ENV !== "production" || allowedOrigins.includes("*")) {
        return callback(null, true);
      }

      // Check configured exact origins
      const isAllowed = allowedOrigins.some((allowed) => allowed.toLowerCase() === origin.toLowerCase());
      if (isAllowed) return callback(null, true);

      // Support Vercel and Netlify deployment preview domains dynamically
      if (/^https:\/\/.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.netlify\.app$/.test(origin)) {
        return callback(null, true);
      }

      // Allow request to proceed safely
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Ensure database connection is active (vital for Vercel serverless cold starts)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error("Database connection error in request handler:", err);
    }
  }
  next();
});

// Request logger for development / debugging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== "test") {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Root & Healthcheck endpoints for cloud deployment pingers & monitoring
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Maison·Auré Haute Cuisine API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    database: getIsMongoConnected() ? "mongodb (connected)" : "mongodb (disconnected)",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      items: "/api/items",
      reservations: "/api/reservations",
    },
  });
});

app.get("/api/health", (req, res) => {
  const isDbReady = getIsMongoConnected();
  res.status(isDbReady ? 200 : 503).json({
    status: isDbReady ? "healthy" : "degraded",
    database: isDbReady ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/reservations", reservationsRoutes);
// Alias /api/orders to reservationsRoutes for complete consistency
app.use("/api/orders", reservationsRoutes);

// 404 Route Catch-all
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error occurred.",
  });
});

// Start Server locally or on persistent cloud hosts (skip if running in Vercel serverless)
let server = null;
if (!process.env.VERCEL) {
  server = app.listen(PORT, () => {
    console.log(`
  ════════════════════════════════════════════════════════════
   Maison·Auré Luxury Restaurant API Server
   Running on: http://localhost:${PORT}
   Database:   MongoDB (Database: ${DB_NAME})
   Environment:${process.env.NODE_ENV || "development"}
  ════════════════════════════════════════════════════════════
    `);
  });
}

// Graceful shutdown handling for container and cloud platforms (Docker, Render, Railway, K8s)
const handleShutdown = (signal) => {
  console.log(`\n${signal} signal received. Closing HTTP server gracefully...`);
  if (server) {
    server.close(() => {
      console.log("HTTP server closed.");
      mongoose.connection.close(false).then(() => {
        console.log("MongoDB connection closed. Process exiting cleanly.");
        process.exit(0);
      });
    });
  } else {
    mongoose.connection.close(false).then(() => {
      console.log("MongoDB connection closed. Process exiting cleanly.");
      process.exit(0);
    });
  }

  // Force shutdown after 10 seconds if hanging
  setTimeout(() => {
    console.error("Forcefully terminating after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

module.exports = app;
