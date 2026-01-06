import { useToast } from "@/providers/ToastProvider";
import { Toast } from "./Toast";


export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 left-1/2 z-[999] w-[80%] -translate-x-1/2 sm:max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
