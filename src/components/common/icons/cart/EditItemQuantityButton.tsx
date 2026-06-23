import LoadingDots from "@components/common/icons/LoadingDots";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { throttle } from "@utils/helper";
import { useAddProduct } from "@utils/hooks/useAddToCart";
import type { CartItemEdge } from "@/types/cart/type";
import clsx from "clsx";

function SubmitButton({
  type,
  handleUpdateCart,
  pending,
  disabled,
}: {
  type: "plus" | "minus";
  handleUpdateCart: (_: "plus" | "minus") => void;
  pending: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      aria-disabled={pending || disabled}
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "ease flex h-full min-w-9 max-w-9 flex-none items-center justify-center rounded-full px-2 transition-all duration-200",
        {
          "cursor-wait": pending,
          "cursor-not-allowed opacity-50": disabled,
          "cursor-pointer hover:border-neutral-800 hover:opacity-80": !pending && !disabled,
          "ml-auto": type === "minus",
        }
      )}
      type="button"
      onClick={() => !disabled && handleUpdateCart(type)}
    >
      {pending ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-100" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-100" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  disabled,
}: {
  item: CartItemEdge;
  type: "plus" | "minus";
  disabled?: boolean;
}) {
  const { onUpdateCart, isUpdateLoading, onAddToRemove, isRemoveLoading } = useAddProduct();

  const handleUpdateCart = throttle((type: "plus" | "minus") => {
    let qty = item?.node?.quantity;
    if (!isUpdateLoading && !isRemoveLoading && !disabled) {
      if (type === "plus") {
        qty += 1;
        onUpdateCart({
          cartItemId: Number(item?.node?.id),
          quantity: qty,
        });
      } else if (type === "minus") {
        if (qty === 1) {
          onAddToRemove(String(item?.node?.id));
        } else {
          qty -= 1;
          onUpdateCart({
            cartItemId: Number(item?.node?.id),
            quantity: qty,
          });
        }
      }
    }
  }, 200);

  return (
    <SubmitButton
      handleUpdateCart={handleUpdateCart}
      pending={isUpdateLoading || isRemoveLoading}
      type={type}
      disabled={disabled}
    />
  );
}
