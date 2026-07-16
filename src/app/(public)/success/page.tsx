import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ORDER_ID } from "@/utils/constants";
import { ClearCartButton } from "@components/checkout/success/EmptyCart";
import OrderDetail from "@components/cart/OrderDetail";
import CheckSign from "@components/common/icons/CheckSign";
import { Suspense } from "react";


async function DynamicOrderReceipt() {
  const cookieStore = await cookies();
  const orderId = cookieStore.get(ORDER_ID)?.value;

  if (!orderId) {
    redirect("/");
  }

  return <OrderDetail orderId={orderId} />;
}

export default function successPage() {

  return (
    <div className="flex min-h-[calc(100vh-450px)] items-center px-4">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden">
        <CheckSign className="h-28 w-28 sm:h-38 sm:w-38" />
        <Suspense fallback={null}>
          <DynamicOrderReceipt />
        </Suspense>
        <ClearCartButton buttonName="Continue shopping" redirect="/" />
      </div>
    </div>
  );
};

