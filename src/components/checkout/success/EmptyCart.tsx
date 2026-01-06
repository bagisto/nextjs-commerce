"use client";
import { clearCart } from "@/store/slices/cart-slice";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CheckSign from "@components/common/icons/CheckSign";
import { useFormStatus } from "react-dom";
import { useDispatch } from "react-redux";
import LoadingDots from "@components/common/icons/LoadingDots";
import dynamic from "next/dynamic";

const OrderDetail = dynamic(() => import("@/components/cart/OrderDetail"), {
  loading: () => (
    <div className="max-w-sm animate-pulse" role="status">
      <div className="mb-4 h-8 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
      <span className="sr-only">Loading...</span>
    </div>
  )
});
const EmptyCartPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-450px)] px-[15px] items-center">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden">
        <CheckSign className="sm:h-38 sm:w-38 h-28 w-28" />
        <OrderDetail />
        <ClearCartButton buttonName="Continue shopping" redirect="/" />
      </div>
    </div>
  );
};

export default EmptyCartPage;

function SubmitButton({
  buttonName,
  redirectNav,
}: {
  buttonName: string;
  redirectNav: string;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pending } = useFormStatus();
  useEffect(() => {
    dispatch(clearCart());
  }, []);
  return (
    <button
      className={clsx(
        "sm:my-3 my-0 w-auto items-center cursor-pointer justify-center rounded-full border-white bg-blue-600 px-12 py-4 text-sm font-bold tracking-wide text-white",
        pending ? "cursor-wait" : "cursor-pointer"
      )}
      disabled={pending}
      type="submit"
      onClick={() => {
        dispatch(clearCart());
        router.replace(redirectNav);
      }}
    >
      {pending ? <LoadingDots className="bg-white" /> : buttonName}
    </button>
  );
}

export function ClearCartButton({
  buttonName,
  redirect,
}: {
  buttonName: string;
  redirect: string;
}) {
  return <SubmitButton buttonName={buttonName} redirectNav={redirect} />;
}
