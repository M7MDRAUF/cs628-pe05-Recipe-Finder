/**
 * src/components/Modal/ConfirmModal.tsx
 * -------------------------------------------------------
 * Reusable confirmation dialog (used for delete actions).
 * Traps focus and responds to Escape key for accessibility.
 * -------------------------------------------------------
 */

import React, { useEffect, useRef } from "react";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Marks the confirm button as a destructive action (red) */
  danger?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button on open for safe default
  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className={styles.backdrop}
      onClick={onCancel}
      role="presentation"
    >
      {/* Dialog – stop propagation so clicks inside don't close */}
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className={styles.title}>
          {title}
        </h2>
        <p id="modal-desc" className={styles.message}>
          {message}
        </p>
        <div className={styles.actions}>
          <button
            ref={cancelRef}
            className={styles.cancelBtn}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`${styles.confirmBtn} ${danger ? styles.danger : ""}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
