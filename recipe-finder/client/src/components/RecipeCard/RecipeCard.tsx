/**
 * src/components/RecipeCard/RecipeCard.tsx
 * -------------------------------------------------------
 * Card component used in the RecipeList grid.
 * Shows thumbnail, name, category, and quick-action links.
 * -------------------------------------------------------
 */

import React from "react";
import { Link } from "react-router-dom";
import type { Recipe } from "@/types/recipe";
import styles from "./RecipeCard.module.css";

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * Returns a placeholder image URL when no imageUrl is provided.
 * Uses a deterministic colour based on recipe name length.
 */
function getPlaceholderImage(name: string): string {
  const colours = ["e85d04", "dc2f02", "f48c06", "9d0208", "370617"];
  const colour  = colours[name.length % colours.length];
  return `https://placehold.co/400x220/${colour}/ffffff?text=${encodeURIComponent(
    name.slice(0, 20)
  )}`;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const imgSrc = recipe.imageUrl || getPlaceholderImage(recipe.name);

  return (
    <article className={styles.card}>
      {/* Thumbnail */}
      <Link to={`/recipes/${recipe._id}`} className={styles.imageLink}>
        <img
          src={imgSrc}
          alt={`Photo of ${recipe.name}`}
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getPlaceholderImage(recipe.name);
          }}
        />
      </Link>

      <div className={styles.body}>
        {/* Category badge */}
        {recipe.category && (
          <span className={styles.badge}>{recipe.category}</span>
        )}

        {/* Recipe name */}
        <h2 className={styles.title}>
          <Link to={`/recipes/${recipe._id}`} className={styles.titleLink}>
            {recipe.name}
          </Link>
        </h2>

        {/* Meta: prep + cook + servings */}
        <div className={styles.meta}>
          {recipe.prepTime && (
            <span title="Prep time">⏱ {recipe.prepTime}</span>
          )}
          {recipe.cookTime && (
            <span title="Cook time">🔥 {recipe.cookTime}</span>
          )}
          {recipe.servings && (
            <span title="Servings">🍴 {recipe.servings} servings</span>
          )}
        </div>

        {/* Ingredient preview */}
        <p className={styles.preview}>
          {recipe.ingredients.slice(0, 4).join(", ")}
          {recipe.ingredients.length > 4 ? "…" : ""}
        </p>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to={`/recipes/${recipe._id}`} className={styles.viewBtn}>
            View Recipe
          </Link>
          <Link to={`/recipes/${recipe._id}/edit`} className={styles.editBtn}>
            Edit
          </Link>
        </div>
      </div>
    </article>
  );
}
