"use client";
import Cart from "../cart/cart";
import { CartSkeleton } from "../product-cart-skeleton";
import Stepper from "../stepper";
import { useCartDetail } from "@/components/hooks/use-cart-detail";
import { useAppSelector } from "@/store/hooks";
import { BagistoCart, CountryArrayDataType } from "@/lib/bagisto/types";
import CheckoutSkeleton from "../place-holder";
interface CheckOutProps {
  countries: CountryArrayDataType[];
  step: string;
}

const CheckOut = ({ countries, step }: CheckOutProps) => {
  const { isLoading } = useCartDetail();
  const cartDetail = useAppSelector((state) => state.cartDetail);

  const cartItems = cartDetail?.cart;
  const billingAddress = cartItems?.billingAddress;
  const shippingAddress = cartItems?.shippingAddress;
  const userEmail = cartItems?.customerEmail;
  const selectedShippingRate = cartItems?.selectedShippingRate;

  const selectedPayment = cartItems?.payment;
  const isGuest = cartItems?.isGuest ?? true;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between lg:flex-row lg:justify-between">
        <div className="w-full px-0 py-2 sm:px-4 sm:py-4 lg:w-1/2 xl:px-16">
          {isLoading ? (
            <CheckoutSkeleton />
          ) : (
            <Stepper
              billingAddress={billingAddress}
              countries={countries}
              currentStep={step}
              isGuest={isGuest}
              selectedPayment={selectedPayment}
              selectedShippingRate={selectedShippingRate}
              shippingAddress={shippingAddress}
              userEmail={userEmail}
            />
          )}
        </div>

        <div className="h-full w-full justify-self-start border-0 border-l border-none border-black/[10%] dark:border-neutral-700 lg:w-1/2 lg:border-solid">
          {isLoading ? (
            <CartSkeleton className="w-full" />
          ) : (
            <div className="max-h-auto w-full flex-initial flex-shrink-0 flex-grow-0 lg:sticky lg:top-0">
              <Cart cart={cartItems as BagistoCart} />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CheckOut;
