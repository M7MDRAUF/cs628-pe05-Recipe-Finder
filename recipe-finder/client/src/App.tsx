/**
 * src/App.tsx
 * -------------------------------------------------------
 * Root application component.
 *
 * Route structure:
 * ──────────────────────────────────────────────────────
 * /                       → Home (landing page)
 * /recipes                → RecipeList (parent layout)
 *   /recipes/:id          → RecipeDetails (nested child)
 * /recipes/add            → AddRecipe
 * /recipes/:id/edit       → EditRecipe
 * *                       → NotFound (404)
 * ──────────────────────────────────────────────────────
 *
 * The <RecipeList> layout renders <Outlet /> which
 * displays <RecipeDetails> as a nested panel within the
 * same page (requirement: "displayed within the same
 * page layout as the Recipe List page").
 * -------------------------------------------------------
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context
import { ToastProvider } from "@/context/ToastContext";

// Layout components
import { Navbar }         from "@/components/Navbar/Navbar";
import { ToastContainer } from "@/components/Toast/ToastContainer";

// Pages
import { Home }          from "@/pages/Home/Home";
import { RecipeList }    from "@/pages/RecipeList/RecipeList";
import { RecipeDetails } from "@/pages/RecipeDetails/RecipeDetails";
import { AddRecipe }     from "@/pages/AddRecipe/AddRecipe";
import { EditRecipe }    from "@/pages/EditRecipe/EditRecipe";
import { NotFound }      from "@/pages/NotFound/NotFound";

// Global styles
import "./index.css";

/**
 * App - Wraps the entire application with the ToastProvider
 * and BrowserRouter, then defines all client-side routes.
 */
export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        {/* Sticky navigation bar */}
        <Navbar />

        {/* Main content area */}
        <main className="main-content">
          <div className="container">
            <Routes>
              {/* Landing page */}
              <Route path="/"       element={<Home />} />

              {/* Add recipe - before :id pattern to prevent conflict */}
              <Route path="/recipes/add" element={<AddRecipe />} />

              {/* Edit recipe - outside RecipeList so it uses full width */}
              <Route path="/recipes/:id/edit" element={<EditRecipe />} />

              {/* Recipe list with nested detail panel */}
              <Route path="/recipes" element={<RecipeList />}>
                {/* Nested route: /recipes/:id */}
                <Route path=":id" element={<RecipeDetails />} />
              </Route>

              {/* Redirect /recipe to /recipes for common typo */}
              <Route path="/recipe" element={<Navigate to="/recipes" replace />} />

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>

        {/* Global toast notification stack */}
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
}
