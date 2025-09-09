"use client";

import type { CartItem } from "@/lib/bagisto/types";

import { TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import { useAddProduct } from "../hooks/use-add-to-cart";

import LoadingDots from "@/components/loading-dots";

function SubmitButton({
  loading,
  handleRemoveCart,
}: {
  loading: boolean;
  handleRemoveCart: () => void;
}) {
  return (
    <button
      aria-disabled={loading}
      aria-label="Remove cart item"
      className={clsx(
        "ease flex h-[17px] w-[17px] cursor-pointer items-center justify-center rounded-full  transition-all duration-200",
        {
          "cursor-wait px-0": loading,
        }
      )}
      type="button"
      onClick={handleRemoveCart}
    >
      {loading ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : (
        <TrashIcon className="hover:text-accent-3 mx-[1px] h-6 w-6" />
      )}
    </button>
  );
}

export function DeleteItemButton({ item }: { item: CartItem }) {
  // const [message, formAction] = useActionState(removeItem, null);
  const { onAddToRemove, isRemoveLoading } = useAddProduct();
  const itemId = item.id;
  // const actionWithVariant = formAction.bind(null, Number(itemId));
  const handleRemoveCart = () => {
    onAddToRemove(itemId);
  };

  return (
    <SubmitButton
      handleRemoveCart={handleRemoveCart}
      loading={isRemoveLoading}
    />
  );
}
