/**
 * src/types/recipe.ts
 * -------------------------------------------------------
 * TypeScript interfaces shared across the entire client.
 * -------------------------------------------------------
 */

/** Full recipe document as returned by the API. */
export interface Recipe {
  /** MongoDB ObjectId serialised as a string */
  _id: string;
  name: string;
  /** Ordered list of ingredient strings */
  ingredients: string[];
  /** Step-by-step cooking instructions */
  instructions: string;
  category: string;
  prepTime: string;
  cookTime: string;
  /** Number of people the recipe serves (null if not provided) */
  servings: number | null;
  imageUrl: string;
  createdAt: string; // ISO-8601 date string from MongoDB
  updatedAt: string;
}

/**
 * Data shape used when creating or updating a recipe.
 * Omits server-managed fields (_id, createdAt, updatedAt).
 */
export type RecipeFormData = Omit<Recipe, "_id" | "createdAt" | "updatedAt">;

/** Generic API response wrapper used by all endpoints. */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: Array<{ field: string; message: string }>;
}
