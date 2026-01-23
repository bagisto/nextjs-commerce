import { useToast } from "@/providers/ToastProvider";
import { Toast } from "./Toast";


export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed left-1/2 z-[999] w-[80%] -translate-x-1/2 sm:max-w-md
        top-4 bottom-auto
        md:bottom-4 md:top-auto"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
