"use client";
import { Alert } from "@heroui/alert";
import { useEffect } from "react";

import { ToastDataType } from "@/app/context/toast-context";

export const Toast = ({
  toast,
  onRemove,
}: {
  toast: ToastDataType;
  onRemove: (_: string) => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div className="z-10 mt-4 flex w-full items-center">
      <Alert
        color={toast?.type}
        isVisible={Boolean(toast.id)}
        title={toast.message}
        variant="faded"
        onClose={() => onRemove(toast.id)}
      />
    </div>
  );
};
