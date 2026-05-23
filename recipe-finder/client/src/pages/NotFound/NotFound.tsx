/**
 * src/pages/NotFound/NotFound.tsx
 * -------------------------------------------------------
 * 404 fallback page for undefined routes.
 * -------------------------------------------------------
 */

import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden="true">404</div>
        <h1 className={styles.heading}>Page Not Found</h1>
        <p className={styles.message}>
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link to="/recipes" className={styles.homeBtn}>
          🍽️ Go to Recipes
        </Link>
      </div>
    </div>
  );
}
