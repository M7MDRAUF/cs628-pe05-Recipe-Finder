/**
 * middleware/errorHandler.js
 * -------------------------------------------------------
 * Centralised Express error-handling middleware.
 *
 * All routes should call next(err) on failure so that
 * errors bubble up here instead of leaking stack traces
 * to API consumers.
 * -------------------------------------------------------
 */

"use strict";

const { MongoServerError } = require("mongodb");

/**
 * notFound – 404 catch-all for unknown routes.
 * Must be registered AFTER all valid route definitions.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

/**
 * errorHandler – global error handler.
 * Express identifies this as an error handler because it
 * has exactly FOUR parameters (err, req, res, next).
 *
 * @param {Error & { status?: number }}  err
 * @param {import('express').Request}    req
 * @param {import('express').Response}   res
 * @param {import('express').NextFunction} _next  (unused but required)
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  // Determine HTTP status code
  let status = err.status || 500;

  // MongoDB duplicate-key error → 409 Conflict
  if (err instanceof MongoServerError && err.code === 11000) {
    status = 409;
    err.message = "Duplicate key error: a recipe with that name already exists.";
  }

  const isDev = process.env.NODE_ENV !== "production";

  console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${status}: ${err.message}`);

  res.status(status).json({
    success: false,
    message: err.message || "Internal server error.",
    // Only expose the stack trace in development mode
    ...(isDev && { stack: err.stack }),
  });
}

module.exports = { notFound, errorHandler };
