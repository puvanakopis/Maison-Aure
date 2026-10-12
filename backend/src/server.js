require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const itemsRoutes = require("./routes/itemsRoutes");
const reservationsRoutes = require("./routes/reservationsRoutes");
const { connectDB, getIsMongoConnected, DB_NAME } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB on startup
connectDB();

// Middlewares
app.use(
  cors({
    origin: "*", // Allow Next.js frontend on localhost:3000 / other ports
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logger for development
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Root & Healthcheck endpoints
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Maison·Auré Haute Cuisine API",
    version: "1.0.0",
    database: getIsMongoConnected() ? "mongodb (connected)" : "mongodb (disconnected)",
    docs: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database: getIsMongoConnected() ? "connected" : "disconnected",
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

// Start Server
app.listen(PORT, () => {
  console.log(`
  ════════════════════════════════════════════════════════════
   Maison·Auré Luxury Restaurant API Server
   Running on: http://localhost:${PORT}
   Database:   MongoDB (Database: ${DB_NAME})
  ════════════════════════════════════════════════════════════
  `);
});
