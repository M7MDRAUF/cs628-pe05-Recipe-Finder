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
        <p className={styles.errorIcon}>⚠️</p>
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
                <span className={styles.metaIcon}>⏱</span>
                <div>
                  <span className={styles.metaLabel}>Prep</span>
                  <span className={styles.metaValue}>{recipe.prepTime}</span>
                </div>
              </div>
            )}
            {recipe.cookTime && (
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>🔥</span>
                <div>
                  <span className={styles.metaLabel}>Cook</span>
                  <span className={styles.metaValue}>{recipe.cookTime}</span>
                </div>
              </div>
            )}
            {recipe.servings && (
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>🍴</span>
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
              ✏️ Edit Recipe
            </Link>
            <button
              className={styles.deleteBtn}
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
            >
              🗑 {deleting ? "Deleting…" : "Delete"}
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
