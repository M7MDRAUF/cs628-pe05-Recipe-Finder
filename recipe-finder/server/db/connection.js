/**
 * db/connection.js
 * -------------------------------------------------------
 * MongoDB Atlas connection module using the official
 * MongoDB Node.js driver (not Mongoose).
 *
 * Exports a singleton MongoClient instance so the same
 * connection pool is reused across all route handlers.
 * -------------------------------------------------------
 */

"use strict";

const { MongoClient, ServerApiVersion } = require("mongodb");

// ── Validate required environment variable ───────────────
if (!process.env.MONGO_URI) {
  console.error(
    "[DB] FATAL: MONGO_URI is not defined. " +
      "Please create a .env file based on .env.example."
  );
  process.exit(1);
}

const uri = process.env.MONGO_URI;

// ── Create MongoClient with Stable API v1 ────────────────
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Connection-pool tuning (safe defaults)
  maxPoolSize: 10,
  minPoolSize: 2,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

/**
 * connectDB – opens the connection and pings the deployment
 * to verify connectivity.  Call once at server start-up.
 *
 * @returns {Promise<void>}
 */
async function connectDB() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "[DB] Successfully connected to MongoDB Atlas (Stable API v1)."
    );
  } catch (err) {
    console.error("[DB] Connection error:", err.message);
    throw err; // Let the caller (server.js) handle exit
  }
}

/**
 * getDB – returns the target database handle.
 * Depends on the DB_NAME env variable (defaults to "recipefinder").
 *
 * @returns {import('mongodb').Db}
 */
function getDB() {
  const dbName = process.env.DB_NAME || "recipefinder";
  return client.db(dbName);
}

/**
 * closeDB – gracefully closes the connection pool.
 * Called on process SIGINT / SIGTERM.
 *
 * @returns {Promise<void>}
 */
async function closeDB() {
  await client.close();
  console.log("[DB] MongoDB connection closed.");
}

module.exports = { connectDB, getDB, closeDB };
