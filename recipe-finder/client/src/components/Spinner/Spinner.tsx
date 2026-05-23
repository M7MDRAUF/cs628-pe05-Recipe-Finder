/**
 * src/components/Spinner/Spinner.tsx
 * -------------------------------------------------------
 * Reusable animated loading spinner.
 * -------------------------------------------------------
 */

import React from "react";
import styles from "./Spinner.module.css";

interface SpinnerProps {
  /** Display an optional message below the spinner */
  message?: string;
  /** Size variant – defaults to "md" */
  size?: "sm" | "md" | "lg";
}

export function Spinner({ message = "Loading…", size = "md" }: SpinnerProps) {
  return (
    <div className={styles.wrapper} role="status" aria-label={message}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
