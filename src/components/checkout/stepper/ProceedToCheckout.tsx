"use client";
import LoadingDots from "@components/common/icons/LoadingDots";
import clsx from "clsx";
import { useFormStatus } from "react-dom";



function SubmitButton({
  availableForSale,
  buttonName,
  className,
}: {
  availableForSale: boolean;
  buttonName: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const buttonClasses =
    "relative text-base w-fit cursor-pointer rounded-full px-8 py-3 font-bold border-white items-center justify-center bg-blue-600 tracking-wide text-white";
  const disabledClasses = "cursor-wait opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Processing...
      </button>
    );
  }

  return (
    <button
      aria-disabled={pending}
      aria-label="Proceed to checkout"
      className={clsx(
        buttonClasses,
        {
          "hover:opacity-90": true,
          disabledClasses: pending,
        },
        className,
      )}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
    >
      <div className="absolute left-0 ml-4">
        {pending && <LoadingDots className="mb-3 bg-white" />}
      </div>
      {buttonName}
    </button>
  );
}

export function ProceedToCheckout({
  buttonName,
  className,
  pending = false,
}: {
  buttonName: string;
  className?: string;
  pending: boolean;
}) {
  return (
    <SubmitButton
      availableForSale={!pending}
      buttonName={buttonName}
      className={className}
    />
  );
}
