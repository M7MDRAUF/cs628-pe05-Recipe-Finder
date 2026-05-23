/**
 * src/components/Toast/ToastContainer.tsx
 * -------------------------------------------------------
 * Renders all active toast notifications as a stack in
 * the bottom-right corner of the viewport.
 * -------------------------------------------------------
 */

import React from "react";
import { useToast } from "@/context/ToastContext";
import styles from "./ToastContainer.module.css";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          role="alert"
        >
          <span className={styles.message}>{toast.message}</span>
          <button
            className={styles.close}
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
