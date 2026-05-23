/**
 * middleware/validateObjectId.js
 * -------------------------------------------------------
 * Express middleware that validates the :id route
 * parameter is a valid MongoDB ObjectId (24-char hex).
 *
 * Usage:
 *   router.get('/:id', validateObjectId, handler);
 * -------------------------------------------------------
 */

"use strict";

const { ObjectId } = require("mongodb");

/**
 * validateObjectId – rejects requests with malformed :id
 * params before they reach the database layer.
 *
 * @param {import('express').Request}     req
 * @param {import('express').Response}    res
 * @param {import('express').NextFunction} next
 */
function validateObjectId(req, res, next) {
  const { id } = req.params;

  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid recipe ID format: "${id}". Must be a 24-character hexadecimal string.`,
    });
  }

  next();
}

module.exports = validateObjectId;
