/**
 * src/pages/AddRecipe/AddRecipe.tsx
 * -------------------------------------------------------
 * Page for creating a new recipe.
 * Uses the shared RecipeForm component and submits via
 * the createRecipe API service.
 * -------------------------------------------------------
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeForm } from "@/components/RecipeForm/RecipeForm";
import { createRecipe } from "@/services/api";
import type { RecipeFormData } from "@/types/recipe";
import { useToast } from "@/context/ToastContext";
import styles from "./AddRecipe.module.css";

export function AddRecipe() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: RecipeFormData) {
    setIsLoading(true);
    try {
      const created = await createRecipe(data);
      addToast(`"${created.name}" was added successfully! 🎉`, "success");
      // Navigate to the new recipe's detail page
      navigate(`/recipes/${created._id}`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create recipe.";
      addToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page header */}
        <div className={styles.header}>
          <h1 className={styles.heading}>Add New Recipe</h1>
          <p className={styles.subheading}>
            Share your favourite dish with the world. Fill in the details below.
          </p>
        </div>

        {/* Form card */}
        <div className={styles.card}>
          <RecipeForm
            onSubmit={handleSubmit}
            submitLabel="Add Recipe"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
