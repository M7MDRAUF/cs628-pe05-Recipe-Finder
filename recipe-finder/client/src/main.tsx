/**
 * src/main.tsx
 * Entry point for the Recipe Finder React application.
 * Mounts the App component into the #root DOM element.
 */
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Mount application – StrictMode enabled for development warnings
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

