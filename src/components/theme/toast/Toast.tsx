"use client";
import { ToastDataType } from "@/providers/ToastProvider";
import { Alert } from "@heroui/alert";
import { motion } from "framer-motion";
import { useEffect } from "react";


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
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="z-10 mt-4 flex w-full items-center dark:backdrop-blur-md dark:bg-[#000000]/30 rounded-xl"
    >
      <Alert
        color={toast?.type}
        isVisible={Boolean(toast.id)}
        title={toast.message}
        variant="faded"
        onClose={() => onRemove(toast.id)}
      />
    </motion.div>
  );
};
