import LoadingDots from "@components/common/icons/LoadingDots";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAddProduct } from "@utils/hooks/useAddToCart";
import clsx from "clsx";


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

export function DeleteItemButton({ item }: { item: any }) {
  // const [message, formAction] = useActionState(removeItem, null);
  const { onAddToRemove, isRemoveLoading } = useAddProduct();
  const itemId = item?.node?.id;
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
