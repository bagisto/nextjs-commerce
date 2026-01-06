import { useToast } from "@/providers/ToastProvider";

export const useCustomToast = () => {
  const { addToast } = useToast();

  const showToast = (
    message: string,
    type: "success" | "danger" | "warning" | "primary" = "primary",
    duration = 5000,
  ) => {
    addToast({ message, type, duration });
  };

  return { showToast };
};
