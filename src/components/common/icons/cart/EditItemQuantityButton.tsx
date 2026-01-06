import LoadingDots from "@components/common/icons/LoadingDots";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useAddProduct } from "@utils/hooks/useAddToCart";
import clsx from "clsx";

function SubmitButton({
  type,
  handleUpdateCart,
  pending,
}: {
  type: "plus" | "minus";
  handleUpdateCart: (_: "plus" | "minus") => void;
  pending: boolean;
}) {
  return (
    <button
      aria-disabled={pending}
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "ease flex h-full cursor-pointer min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "cursor-wait": pending,
          "ml-auto": type === "minus",
        }
      )}
      type="button"
      onClick={() => handleUpdateCart(type)}
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
}: {
  item: any;
  type: "plus" | "minus";
}) {
  const { onUpdateCart, isUpdateLoading } = useAddProduct();

  const handleUpdateCart = (type: "plus" | "minus") => {
    let qty = item?.node?.quantity;

    if (type === "plus") {
      qty += 1;
    } else if (type === "minus") {
      qty -= 1;
    }
    onUpdateCart({
      cartItemId: Number(item?.node?.id),
      quantity: qty,
    });
  };

  return (
    <SubmitButton
      handleUpdateCart={handleUpdateCart}
      pending={isUpdateLoading}
      type={type}
    />
  );
}
