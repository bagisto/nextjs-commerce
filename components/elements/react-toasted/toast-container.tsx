"use client";
import { Toast } from "./toast";

import { useToast } from "@/app/context/toast-context";

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 left-1/2 z-[999] max-w-md -translate-x-1/2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
