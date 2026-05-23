/**
 * routes/recipes.js
 * -------------------------------------------------------
 * Express router – full CRUD for the /api/recipes resource.
 *
 * Endpoints
 * ─────────────────────────────────────────────────────────
 * GET    /api/recipes            – list all recipes
 * GET    /api/recipes/:id        – get one recipe
 * POST   /api/recipes            – create a recipe
 * PUT    /api/recipes/:id        – update a recipe
 * DELETE /api/recipes/:id        – delete a recipe
 * -------------------------------------------------------
 */

"use strict";

const express = require("express");
const { ObjectId } = require("mongodb");
const { body, validationResult } = require("express-validator");
const { getDB } = require("../db/connection");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

// ── Collection name constant ──────────────────────────────
const COLLECTION = "recipes";

// ── Reusable validation rules ─────────────────────────────
const recipeValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Recipe name is required.")
    .isLength({ min: 2, max: 120 })
    .withMessage("Recipe name must be between 2 and 120 characters."),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("At least one ingredient is required."),

  body("ingredients.*")
    .trim()
    .notEmpty()
    .withMessage("Each ingredient must be a non-empty string."),

  body("instructions")
    .trim()
    .notEmpty()
    .withMessage("Cooking instructions are required.")
    .isLength({ min: 10 })
    .withMessage("Instructions must be at least 10 characters long."),

  body("category")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 60 })
    .withMessage("Category must be at most 60 characters."),

  body("prepTime")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 30 })
    .withMessage("Prep time must be at most 30 characters."),

  body("cookTime")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 30 })
    .withMessage("Cook time must be at most 30 characters."),

  body("servings")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage("Servings must be an integer between 1 and 100."),

  body("imageUrl")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("imageUrl must be a valid URL."),
];

/**
 * Helper – centralise validation-result handling.
 * Returns 422 if express-validator found errors.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @returns {boolean} true if there are errors (response already sent)
 */
function handleValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: "Validation failed. Please correct the following errors.",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
    return true;
  }
  return false;
}

// ──────────────────────────────────────────────────────────
// GET /api/recipes
// Returns all recipes sorted by creation date (newest first).
// Supports optional ?search=query and ?category=cat filters.
// ──────────────────────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const db = getDB();
    const { search, category } = req.query;

    // Build MongoDB filter
    const filter = {};

    if (search && search.trim()) {
      // Case-insensitive text search on name and ingredients
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { ingredients: { $elemMatch: { $regex: search.trim(), $options: "i" } } },
      ];
    }

    if (category && category.trim()) {
      filter.category = { $regex: `^${category.trim()}$`, $options: "i" };
    }

    const recipes = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// GET /api/recipes/:id
// Returns a single recipe by its MongoDB ObjectId.
// ──────────────────────────────────────────────────────────
router.get("/:id", validateObjectId, async (req, res, next) => {
  try {
    const db = getDB();
    const recipe = await db
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe with ID "${req.params.id}" was not found.`,
      });
    }

    res.json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// POST /api/recipes
// Creates a new recipe document in MongoDB.
// ──────────────────────────────────────────────────────────
router.post("/", recipeValidationRules, async (req, res, next) => {
  // Return 422 if validation failed
  if (handleValidationErrors(req, res)) return;

  try {
    const db = getDB();

    const newRecipe = {
      name:         req.body.name.trim(),
      ingredients:  req.body.ingredients.map((i) => i.trim()),
      instructions: req.body.instructions.trim(),
      category:     req.body.category?.trim()  || "",
      prepTime:     req.body.prepTime?.trim()  || "",
      cookTime:     req.body.cookTime?.trim()  || "",
      servings:     req.body.servings ? Number(req.body.servings) : null,
      imageUrl:     req.body.imageUrl?.trim()  || "",
      createdAt:    new Date(),
      updatedAt:    new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(newRecipe);

    console.log(`[RECIPES] Created recipe "${newRecipe.name}" (id: ${result.insertedId})`);

    res.status(201).json({
      success: true,
      message: "Recipe created successfully.",
      data: { _id: result.insertedId, ...newRecipe },
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// PUT /api/recipes/:id
// Updates an existing recipe.  Only supplied fields change.
// ──────────────────────────────────────────────────────────
router.put("/:id", validateObjectId, recipeValidationRules, async (req, res, next) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const db = getDB();

    const updates = {
      name:         req.body.name.trim(),
      ingredients:  req.body.ingredients.map((i) => i.trim()),
      instructions: req.body.instructions.trim(),
      category:     req.body.category?.trim()  || "",
      prepTime:     req.body.prepTime?.trim()  || "",
      cookTime:     req.body.cookTime?.trim()  || "",
      servings:     req.body.servings ? Number(req.body.servings) : null,
      imageUrl:     req.body.imageUrl?.trim()  || "",
      updatedAt:    new Date(),
    };

    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Recipe with ID "${req.params.id}" was not found.`,
      });
    }

    console.log(`[RECIPES] Updated recipe "${result.name}" (id: ${req.params.id})`);

    res.json({
      success: true,
      message: "Recipe updated successfully.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// DELETE /api/recipes/:id
// Permanently removes a recipe from the database.
// ──────────────────────────────────────────────────────────
router.delete("/:id", validateObjectId, async (req, res, next) => {
  try {
    const db = getDB();
    const result = await db
      .collection(COLLECTION)
      .findOneAndDelete({ _id: new ObjectId(req.params.id) });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Recipe with ID "${req.params.id}" was not found.`,
      });
    }

    console.log(`[RECIPES] Deleted recipe "${result.name}" (id: ${req.params.id})`);

    res.json({
      success: true,
      message: `Recipe "${result.name}" was deleted successfully.`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
