/**
 * src/services/api.ts
 * -------------------------------------------------------
 * Axios-based API service for the Recipe Finder back-end.
 *
 * All methods return the unwrapped `data` property from
 * the API response to keep callers simple.
 * -------------------------------------------------------
 */

import axios, { AxiosError } from "axios";
import type { Recipe, RecipeFormData, ApiResponse } from "@/types/recipe";

// ── Create a configured Axios instance ───────────────────
const apiClient = axios.create({
  // During development Vite proxies /api → http://localhost:5000
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15-second request timeout
});

// ── Response interceptor – normalise errors ───────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    // Attach a user-friendly message to every rejected promise
    const serverMessage =
      error.response?.data?.message || error.message || "An unexpected error occurred.";
    return Promise.reject(new Error(serverMessage));
  }
);

// ──────────────────────────────────────────────────────────
// Public API functions
// ──────────────────────────────────────────────────────────

/**
 * Fetch all recipes.
 * Supports optional search (text) and category filters.
 *
 * @param params.search   - free-text search term
 * @param params.category - exact category filter
 */
export async function getAllRecipes(params?: {
  search?: string;
  category?: string;
}): Promise<Recipe[]> {
  const response = await apiClient.get<ApiResponse<Recipe[]>>("/recipes", {
    params,
  });
  return response.data.data ?? [];
}

/**
 * Fetch a single recipe by its MongoDB ObjectId.
 *
 * @param id - 24-character hex ObjectId string
 */
export async function getRecipeById(id: string): Promise<Recipe> {
  const response = await apiClient.get<ApiResponse<Recipe>>(`/recipes/${id}`);
  if (!response.data.data) {
    throw new Error("Recipe data missing from response.");
  }
  return response.data.data;
}

/**
 * Create a new recipe.
 *
 * @param data - RecipeFormData without server-managed fields
 */
export async function createRecipe(data: RecipeFormData): Promise<Recipe> {
  const response = await apiClient.post<ApiResponse<Recipe>>("/recipes", data);
  if (!response.data.data) {
    throw new Error("Created recipe data missing from response.");
  }
  return response.data.data;
}

/**
 * Update an existing recipe.
 *
 * @param id   - MongoDB ObjectId of the recipe to update
 * @param data - Partial or full RecipeFormData
 */
export async function updateRecipe(
  id: string,
  data: RecipeFormData
): Promise<Recipe> {
  const response = await apiClient.put<ApiResponse<Recipe>>(`/recipes/${id}`, data);
  if (!response.data.data) {
    throw new Error("Updated recipe data missing from response.");
  }
  return response.data.data;
}

/**
 * Delete a recipe by ID.
 *
 * @param id - MongoDB ObjectId of the recipe to delete
 */
export async function deleteRecipe(id: string): Promise<void> {
  await apiClient.delete(`/recipes/${id}`);
}
