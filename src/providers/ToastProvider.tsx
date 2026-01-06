"use client";
import { ReactNode, createContext, useContext, useState } from "react";

export type ToastType = "success" | "danger" | "warning" | "primary";

export interface ToastDataType {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastContextType {
  toasts: ToastDataType[];
  addToast: (_: Omit<ToastDataType, "id">) => void;
  removeToast: (_: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastDataType[]>([]);

  const addToast = (toast: Omit<ToastDataType, "id">) => {
    // eslint-disable-next-line react-hooks/purity
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, ...toast };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
