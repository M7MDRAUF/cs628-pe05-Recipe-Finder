/**
 * src/pages/RecipeDetails/RecipeDetails.tsx
 * -------------------------------------------------------
 * Nested route under /recipes/:id
 *
 * Displays full details for a single recipe.
 * Uses useParams() to extract the recipe ID from the URL,
 * then fetches the recipe from the API.
 *
 * Provides Edit and Delete actions.
 * Delete triggers the ConfirmModal before proceeding.
 * -------------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRecipeById, deleteRecipe } from "@/services/api";
import type { Recipe } from "@/types/recipe";
import { Spinner } from "@/components/Spinner/Spinner";
import { ConfirmModal } from "@/components/Modal/ConfirmModal";
import { useToast } from "@/context/ToastContext";
import styles from "./RecipeDetails.module.css";

export function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [recipe, setRecipe]           = useState<Recipe | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting]       = useState(false);
  /**
   * retryCount is bumped when the user presses "Retry".
   * Including it in the useEffect dependency array re-triggers the fetch.
   */
  const [retryCount, setRetryCount] = useState(0);

  // ── Fetch the recipe by ID ────────────────────────────────
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecipeById(id!);
        if (!cancelled) setRecipe(data);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Failed to load recipe.";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id, retryCount]);

  // ── Delete handler ────────────────────────────────────────
  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteRecipe(id);
      addToast(`"${recipe?.name}" was deleted successfully.`, "success");
      navigate("/recipes");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed.";
      addToast(msg, "error");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  // ── Loading ───────────────────────────────────────────────
  if (loading) return <Spinner message="Loading recipe details…" size="lg" />;

  // ── Error ─────────────────────────────────────────────────
  if (error) {
    return (
      <div className={styles.errorState} role="alert">
        <p className={styles.errorIcon}>!</p>
        <p>{error}</p>
        <div className={styles.errorActions}>
          <button className={styles.retryBtn} onClick={() => setRetryCount((c) => c + 1)}>
            Retry
          </button>
          <Link to="/recipes" className={styles.backLink}>
            ← Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────
  if (!recipe) return null;

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      <article className={styles.article}>
        {/* Hero image */}
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={`Photo of ${recipe.name}`}
            className={styles.heroImage}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}

        <div className={styles.content}>
          {/* Back link */}
          <Link to="/recipes" className={styles.backLink}>
            ← All Recipes
          </Link>

          {/* Title + category */}
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{recipe.name}</h1>
            {recipe.category && (
              <span className={styles.badge}>{recipe.category}</span>
            )}
          </div>

          {/* Meta strip */}
          <div className={styles.meta}>
            {recipe.prepTime && (
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                  </svg>
                </span>
                <div>
                  <span className={styles.metaLabel}>Prep</span>
                  <span className={styles.metaValue}>{recipe.prepTime}</span>
                </div>
              </div>
            )}
            {recipe.cookTime && (
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                    <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8.17-15.03-8.17-15.03 0h15.03zM1.02 17h15v2h-15z"/>
                  </svg>
                </span>
                <div>
                  <span className={styles.metaLabel}>Cook</span>
                  <span className={styles.metaValue}>{recipe.cookTime}</span>
                </div>
              </div>
            )}
            {recipe.servings && (
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                  </svg>
                </span>
                <div>
                  <span className={styles.metaLabel}>Servings</span>
                  <span className={styles.metaValue}>{recipe.servings}</span>
                </div>
              </div>
            )}
          </div>

          {/* Ingredients */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ingredients</h2>
            <ul className={styles.ingredientList}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className={styles.ingredientItem}>
                  {ing}
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Instructions</h2>
            <div className={styles.instructions}>
              {recipe.instructions.split("\n").map((line, i) =>
                line.trim() ? <p key={i}>{line}</p> : <br key={i} />
              )}
            </div>
          </section>

          {/* Timestamps */}
          <div className={styles.timestamps}>
            <span>Added: {new Date(recipe.createdAt).toLocaleDateString()}</span>
            {recipe.updatedAt !== recipe.createdAt && (
              <span>
                Updated: {new Date(recipe.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>
            <Link
              to={`/recipes/${recipe._id}/edit`}
              className={styles.editBtn}
            >
              Edit Recipe
            </Link>
            <button
              className={styles.deleteBtn}
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </article>

      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Recipe"
        message={`Are you sure you want to permanently delete "${recipe.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
