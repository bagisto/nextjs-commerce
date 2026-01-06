"use client";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cart-slice";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function SubmitButton({
  buttonName,
  redirectNav,
}: {
  buttonName: string;
  redirectNav: string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(clearCart());
  }, []);
  return (
    <button
      aria-label={buttonName}
      className={clsx(
        " my-3 w-auto items-center cursor-pointer justify-center rounded-full border-white bg-blue-600 px-12 py-4 text-sm font-bold tracking-wide text-white",
        {
          "hover:opacity-90": true,
        }
      )}
      type="button"
      onClick={() => {
        router.push(redirectNav);
      }}
    >
      {buttonName}
    </button>
  );
}

export function EventButton({
  buttonName,
  redirect,
}: {
  buttonName: string;
  redirect: string;
}) {
  return <SubmitButton buttonName={buttonName} redirectNav={redirect} />;
}
