/**
 * src/pages/EditRecipe/EditRecipe.tsx
 * -------------------------------------------------------
 * Page for editing an existing recipe.
 *
 * Uses useParams() to get the recipe ID, fetches the
 * current data, pre-populates the RecipeForm, then
 * submits the update via the updateRecipe API service.
 * -------------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getRecipeById, updateRecipe } from "@/services/api";
import type { Recipe, RecipeFormData } from "@/types/recipe";
import { RecipeForm } from "@/components/RecipeForm/RecipeForm";
import { Spinner } from "@/components/Spinner/Spinner";
import { useToast } from "@/context/ToastContext";
import styles from "./EditRecipe.module.css";

export function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [recipe, setRecipe]     = useState<Recipe | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ── Load existing recipe data ─────────────────────────────
  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to load recipe.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ── Submit update ─────────────────────────────────────────
  async function handleSubmit(data: RecipeFormData) {
    if (!id) return;
    setIsSaving(true);
    try {
      const updated = await updateRecipe(id, data);
      addToast(`"${updated.name}" updated successfully! ✅`, "success");
      navigate(`/recipes/${id}`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update recipe.";
      addToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  }

  // ── Loading state ─────────────────────────────────────────
  if (loading) return <Spinner message="Loading recipe for editing…" size="lg" />;

  // ── Error state ───────────────────────────────────────────
  if (error || !recipe) {
    return (
      <div className={styles.errorState} role="alert">
        <p>⚠️ {error || "Recipe not found."}</p>
        <Link to="/recipes" className={styles.backLink}>
          ← Back to Recipes
        </Link>
      </div>
    );
  }

  // ── Build initialValues from fetched recipe ───────────────
  const initialValues: RecipeFormData = {
    name:         recipe.name,
    ingredients:  recipe.ingredients,
    instructions: recipe.instructions,
    category:     recipe.category,
    prepTime:     recipe.prepTime,
    cookTime:     recipe.cookTime,
    servings:     recipe.servings,
    imageUrl:     recipe.imageUrl,
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page header */}
        <div className={styles.header}>
          <Link to={`/recipes/${id}`} className={styles.backLink}>
            ← Back to Recipe
          </Link>
          <h1 className={styles.heading}>Edit Recipe</h1>
          <p className={styles.subheading}>
            Updating: <strong>{recipe.name}</strong>
          </p>
        </div>

        {/* Form card */}
        <div className={styles.card}>
          <RecipeForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            isLoading={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
