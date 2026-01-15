import { ClearCartButton } from "@components/checkout/success/EmptyCart";
import OrderDetail from "@components/cart/OrderDetail";
import CheckSign from "@components/common/icons/CheckSign";

const SuccessPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-450px)] items-center px-4">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden">
        <CheckSign className="h-28 w-28 sm:h-38 sm:w-38" />
        <OrderDetail />
        <ClearCartButton buttonName="Continue shopping" redirect="/" />
      </div>
    </div>
  );
};

export default SuccessPage;
