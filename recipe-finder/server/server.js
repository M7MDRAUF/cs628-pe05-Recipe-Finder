/**
 * server.js
 * -------------------------------------------------------
 * Recipe Finder – Express application entry point.
 *
 * Responsibilities
 * ─────────────────────────────────────────────────────────
 * • Load environment variables from .env
 * • Connect to MongoDB Atlas
 * • Register Express middleware (CORS, JSON body-parser,
 *   request logger)
 * • Mount API routes
 * • Register 404 + global error handlers
 * • Start HTTP server on configured PORT
 * • Gracefully close DB connection on SIGINT / SIGTERM
 * -------------------------------------------------------
 */

"use strict";

// ── Load env variables FIRST (before any other imports) ──
require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const { connectDB, closeDB } = require("./db/connection");
const recipesRouter            = require("./routes/recipes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// ── App setup ─────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security-aware CORS configuration ────────────────────
// In production replace the origin with your deployed front-end URL.
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_ORIGIN || "https://your-deployed-app.com"
      : ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// ── Body parsers ──────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ── Simple request logger (dev) ───────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ── Health-check endpoint ─────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ success: true, status: "OK", timestamp: new Date().toISOString() });
});

// ── API routes ────────────────────────────────────────────
app.use("/api/recipes", recipesRouter);

// ── 404 – must come AFTER all valid routes ────────────────
app.use(notFound);

// ── Global error handler – must be LAST middleware ────────
app.use(errorHandler);

// ── Bootstrap: connect to DB, then start HTTP server ──────
(async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`[SERVER] Recipe Finder API running on http://localhost:${PORT}`);
      console.log(`[SERVER] Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // ── Graceful shutdown ──────────────────────────────────
    const shutdown = async (signal) => {
      console.log(`\n[SERVER] ${signal} received – shutting down gracefully …`);
      server.close(async () => {
        await closeDB();
        console.log("[SERVER] HTTP server closed. Exiting.");
        process.exit(0);
      });
    };

    process.on("SIGINT",  () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error("[SERVER] Failed to start:", err.message);
    process.exit(1);
  }
})();
