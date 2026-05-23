/**
 * src/pages/RecipeList/RecipeList.tsx
 * -------------------------------------------------------
 * Displays the full list of recipes in a responsive grid.
 * Also serves as the PARENT route that renders nested
 * RecipeDetails via <Outlet />.
 *
 * Features:
 *  - Search bar (client-driven API query param)
 *  - Category filter dropdown
 *  - Loading / error states
 *  - Empty state
 * -------------------------------------------------------
 */

import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { getAllRecipes } from "@/services/api";
import type { Recipe } from "@/types/recipe";
import { RecipeCard } from "@/components/RecipeCard/RecipeCard";
import { Spinner } from "@/components/Spinner/Spinner";
import styles from "./RecipeList.module.css";

const CATEGORIES = [
  "All",
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

export function RecipeList() {
  const [recipes, setRecipes]   = useState<Recipe[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  /**
   * refreshTick is incremented to trigger a data re-fetch without
   * requiring fetchRecipes() to be a useCallback dependency.
   * Child routes call onUpdate() (= refreshList) after mutations.
   */
  const [refreshTick, setRefreshTick] = useState(0);

  const location = useLocation();

  // Determine if a nested route (RecipeDetails) is active
  const isNestedRouteActive = location.pathname !== "/recipes";

  /**
   * refreshList is passed to child routes via Outlet context.
   * Incrementing refreshTick causes the data-fetch effect to re-run.
   */
  const refreshList = useCallback(() => setRefreshTick((n) => n + 1), []);

  // ── Data fetch ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params: { search?: string; category?: string } = {};
        if (search.trim())      params.search   = search.trim();
        if (category !== "All") params.category = category;

        const data = await getAllRecipes(params);
        if (!cancelled) setRecipes(data);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Failed to load recipes.";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [search, category, refreshTick]);

  // ── Search submit ─────────────────────────────────────────
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Bump refreshTick so the effect re-runs with current filters
    setRefreshTick((n) => n + 1);
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className={styles.wrapper}>
      {/* Left panel: list */}
      <div className={styles.listPanel}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.heading}>Recipes</h1>
          <p className={styles.subheading}>
            {loading ? "Fetching recipes…" : `${recipes.length} recipe${recipes.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Search + Filter */}
        <form className={styles.filters} onSubmit={handleSearchSubmit}>
          <div className={styles.searchWrapper}>
            <input
              type="search"
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or ingredient…"
              aria-label="Search recipes"
            />
            <button type="submit" className={styles.searchBtn} aria-label="Search">
              🔍
            </button>
          </div>

          <select
            className={styles.categoryFilter}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </form>

        {/* States */}
        {loading && <Spinner message="Loading recipes…" />}

        {!loading && error && (
          <div className={styles.errorState} role="alert">
            <p>⚠️ {error}</p>
            <button className={styles.retryBtn} onClick={() => setRefreshTick((n) => n + 1)}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>🍳</p>
            <p>No recipes found.</p>
            {(search || category !== "All") && (
              <button
                className={styles.retryBtn}
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Recipe grid */}
        {!loading && !error && recipes.length > 0 && (
          <div className={styles.grid}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>

      {/* Right panel: nested RecipeDetails */}
      {isNestedRouteActive && (
        <div className={styles.detailPanel}>
          <Outlet context={{ onUpdate: refreshList }} />
        </div>
      )}
    </div>
  );
}
