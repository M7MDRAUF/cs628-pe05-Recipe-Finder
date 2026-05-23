/**
 * src/components/RecipeForm/RecipeForm.tsx
 * -------------------------------------------------------
 * Shared form component used by both AddRecipe and
 * EditRecipe pages.
 *
 * Features:
 *  - Full client-side validation with descriptive errors
 *  - Dynamic ingredient list (add / remove rows)
 *  - Accessible labels and ARIA attributes
 *  - Loading state on submit
 * -------------------------------------------------------
 */

import React, { useState } from "react";
import type { RecipeFormData } from "@/types/recipe";
import styles from "./RecipeForm.module.css";

// ── Types ──────────────────────────────────────────────────
interface FormErrors {
  name?: string;
  ingredients?: string;
  instructions?: string;
  servings?: string;
  imageUrl?: string;
}

interface RecipeFormProps {
  /** Pre-populated values when editing an existing recipe */
  initialValues?: Partial<RecipeFormData>;
  /** Called with validated form data on submit */
  onSubmit: (data: RecipeFormData) => Promise<void>;
  /** Label text for the submit button */
  submitLabel?: string;
  /** Whether the parent is performing an async operation */
  isLoading?: boolean;
}

// ── Default empty form state ───────────────────────────────
const DEFAULT_VALUES: RecipeFormData = {
  name: "",
  ingredients: [""],
  instructions: "",
  category: "",
  prepTime: "",
  cookTime: "",
  servings: null,
  imageUrl: "",
};

// ── Predefined category options ────────────────────────────
const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Beverage",
  "Appetiser",
  "Soup",
  "Salad",
  "Baking",
  "Vegetarian",
  "Vegan",
  "Other",
];

export function RecipeForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Recipe",
  isLoading = false,
}: RecipeFormProps) {
  // Merge defaults with any provided initial values
  const [values, setValues] = useState<RecipeFormData>({
    ...DEFAULT_VALUES,
    ...initialValues,
    // Ensure ingredients always has at least one entry
    ingredients:
      initialValues?.ingredients?.length
        ? initialValues.ingredients
        : [""],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // ── Input change handlers ────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear the field error on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleIngredientChange(index: number, value: string) {
    const updated = [...values.ingredients];
    updated[index] = value;
    setValues((prev) => ({ ...prev, ingredients: updated }));
    setErrors((prev) => ({ ...prev, ingredients: undefined }));
  }

  function addIngredient() {
    setValues((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  }

  function removeIngredient(index: number) {
    if (values.ingredients.length <= 1) return; // keep at least one row
    const updated = values.ingredients.filter((_, i) => i !== index);
    setValues((prev) => ({ ...prev, ingredients: updated }));
  }

  // ── Validation ───────────────────────────────────────────
  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!values.name.trim()) {
      newErrors.name = "Recipe name is required.";
    } else if (values.name.trim().length < 2 || values.name.trim().length > 120) {
      newErrors.name = "Recipe name must be between 2 and 120 characters.";
    }

    const filledIngredients = values.ingredients.filter((i) => i.trim());
    if (filledIngredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required.";
    }

    if (!values.instructions.trim()) {
      newErrors.instructions = "Cooking instructions are required.";
    } else if (values.instructions.trim().length < 10) {
      newErrors.instructions = "Instructions must be at least 10 characters.";
    }

    if (values.servings !== null && values.servings !== undefined) {
      const n = Number(values.servings);
      if (!Number.isInteger(n) || n < 1 || n > 100) {
        newErrors.servings = "Servings must be a whole number between 1 and 100.";
      }
    }

    if (values.imageUrl && values.imageUrl.trim()) {
      try {
        new URL(values.imageUrl);
      } catch {
        newErrors.imageUrl = "Please enter a valid URL (e.g. https://…).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Submit ───────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Strip empty ingredient rows before submitting
    const cleanedData: RecipeFormData = {
      ...values,
      name:         values.name.trim(),
      ingredients:  values.ingredients.filter((i) => i.trim()).map((i) => i.trim()),
      instructions: values.instructions.trim(),
      category:     values.category?.trim() || "",
      prepTime:     values.prepTime?.trim() || "",
      cookTime:     values.cookTime?.trim() || "",
      servings:     values.servings ? Number(values.servings) : null,
      imageUrl:     values.imageUrl?.trim() || "",
    };

    await onSubmit(cleanedData);
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Recipe form"
    >
      {/* ── Name ─────────────────────────────────────────── */}
      <div className={`${styles.field} ${errors.name ? styles.hasError : ""}`}>
        <label htmlFor="name" className={styles.label}>
          Recipe Name <span className={styles.required}>*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className={styles.input}
          value={values.name}
          onChange={handleChange}
          placeholder="e.g. Spaghetti Carbonara"
          maxLength={120}
          aria-required="true"
          aria-describedby={errors.name ? "name-error" : undefined}
          disabled={isLoading}
        />
        {errors.name && (
          <p id="name-error" className={styles.error} role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* ── Category ─────────────────────────────────────── */}
      <div className={styles.field}>
        <label htmlFor="category" className={styles.label}>
          Category
        </label>
        <select
          id="category"
          name="category"
          className={styles.select}
          value={values.category}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">— Select a category —</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ── Prep / Cook / Servings ────────────────────────── */}
      <div className={styles.row3}>
        <div className={styles.field}>
          <label htmlFor="prepTime" className={styles.label}>
            Prep Time
          </label>
          <input
            id="prepTime"
            name="prepTime"
            type="text"
            className={styles.input}
            value={values.prepTime}
            onChange={handleChange}
            placeholder="e.g. 15 min"
            maxLength={30}
            disabled={isLoading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="cookTime" className={styles.label}>
            Cook Time
          </label>
          <input
            id="cookTime"
            name="cookTime"
            type="text"
            className={styles.input}
            value={values.cookTime}
            onChange={handleChange}
            placeholder="e.g. 30 min"
            maxLength={30}
            disabled={isLoading}
          />
        </div>

        <div className={`${styles.field} ${errors.servings ? styles.hasError : ""}`}>
          <label htmlFor="servings" className={styles.label}>
            Servings
          </label>
          <input
            id="servings"
            name="servings"
            type="number"
            className={styles.input}
            value={values.servings ?? ""}
            onChange={handleChange}
            placeholder="e.g. 4"
            min={1}
            max={100}
            disabled={isLoading}
            aria-describedby={errors.servings ? "servings-error" : undefined}
          />
          {errors.servings && (
            <p id="servings-error" className={styles.error} role="alert">
              {errors.servings}
            </p>
          )}
        </div>
      </div>

      {/* ── Ingredients ──────────────────────────────────── */}
      <fieldset
        className={`${styles.fieldset} ${errors.ingredients ? styles.hasError : ""}`}
      >
        <legend className={styles.legend}>
          Ingredients <span className={styles.required}>*</span>
        </legend>

        {values.ingredients.map((ingredient, index) => (
          <div key={index} className={styles.ingredientRow}>
            <input
              type="text"
              className={styles.input}
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              placeholder={`Ingredient ${index + 1} (e.g. 200g spaghetti)`}
              aria-label={`Ingredient ${index + 1}`}
              disabled={isLoading}
            />
            {values.ingredients.length > 1 && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeIngredient(index)}
                aria-label={`Remove ingredient ${index + 1}`}
                disabled={isLoading}
              >
                &times;
              </button>
            )}
          </div>
        ))}

        {errors.ingredients && (
          <p className={styles.error} role="alert">
            {errors.ingredients}
          </p>
        )}

        <button
          type="button"
          className={styles.addIngredientBtn}
          onClick={addIngredient}
          disabled={isLoading}
        >
          + Add Ingredient
        </button>
      </fieldset>

      {/* ── Instructions ─────────────────────────────────── */}
      <div
        className={`${styles.field} ${errors.instructions ? styles.hasError : ""}`}
      >
        <label htmlFor="instructions" className={styles.label}>
          Cooking Instructions <span className={styles.required}>*</span>
        </label>
        <textarea
          id="instructions"
          name="instructions"
          className={styles.textarea}
          value={values.instructions}
          onChange={handleChange}
          placeholder="Describe each step clearly…"
          rows={6}
          aria-required="true"
          aria-describedby={errors.instructions ? "instructions-error" : undefined}
          disabled={isLoading}
        />
        {errors.instructions && (
          <p id="instructions-error" className={styles.error} role="alert">
            {errors.instructions}
          </p>
        )}
      </div>

      {/* ── Image URL ─────────────────────────────────────── */}
      <div
        className={`${styles.field} ${errors.imageUrl ? styles.hasError : ""}`}
      >
        <label htmlFor="imageUrl" className={styles.label}>
          Image URL <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          className={styles.input}
          value={values.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/recipe-photo.jpg"
          aria-describedby={errors.imageUrl ? "imageUrl-error" : undefined}
          disabled={isLoading}
        />
        {errors.imageUrl && (
          <p id="imageUrl-error" className={styles.error} role="alert">
            {errors.imageUrl}
          </p>
        )}
      </div>

      {/* ── Submit ───────────────────────────────────────── */}
      <div className={styles.submitRow}>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
