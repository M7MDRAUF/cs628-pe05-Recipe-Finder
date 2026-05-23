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
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
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
            <p>! {error}</p>
            <button className={styles.retryBtn} onClick={() => setRefreshTick((n) => n + 1)}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48" aria-hidden="true">
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
              </svg>
            </p>
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
