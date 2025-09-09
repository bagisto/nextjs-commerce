"use client";
import dynamic from "next/dynamic";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cart-slice";
import clsx from "clsx";
import { useRouter, redirect } from "next/navigation";
import { useEffect } from "react";
import CheckSign from "@/components/icons/check-sign";
import { useFormStatus } from "react-dom";
import LoadingDots from "@/components/loading-dots";
import { useDispatch } from "react-redux";

const OrderDetail = dynamic(() => import("../cart/order-detail"), {
  loading: () => (
    <div className="max-w-sm animate-pulse" role="status">
      <div className="mb-4 h-8 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
      <span className="sr-only">Loading...</span>
    </div>
  ),
  ssr: true,
});
const EmptyCartPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-450px)] items-center">
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
