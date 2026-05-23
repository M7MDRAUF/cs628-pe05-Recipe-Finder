/**
 * src/context/ToastContext.tsx
 * -------------------------------------------------------
 * Lightweight global toast notification system.
 * Provides useToast() hook consumed by all pages.
 * -------------------------------------------------------
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

// ── Types ──────────────────────────────────────────────────
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
}

// ── Context ────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let nextId = 1;
const AUTO_DISMISS_MS = 4000; // toasts auto-dismiss after 4 s

// ── Provider ───────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      // Auto-dismiss
      setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────
/**
 * useToast – access toast utilities inside any component.
 * Must be used within a <ToastProvider>.
 *
 * Note: exporting a hook alongside a component in the same file is
 * intentional here (context + its accessor belong together).
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}
