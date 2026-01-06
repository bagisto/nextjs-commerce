"use client";
import { useAppSelector } from "@/store/hooks";
import CheckoutSkeleton from "../common/skeleton/CheckoutSkeleton";
import { CartSkeleton } from "../common/skeleton/ProductCartSkeleton";
import { useCartDetail } from "@/utils/hooks/useCartDetail";
import CheckoutCart from "./checkout-cart/CheckoutCart";
import Stepper from "./stepper";
import { useState, useEffect } from 'react';
import { useAddressesFromApi } from "@utils/helper";



interface CheckOutProps {
  step: string;
}

const CheckOut = ({ step }: CheckOutProps) => {
  const { isLoading } = useCartDetail();
  const { billingAddress, shippingAddress } = useAddressesFromApi();
  const cartDetail = useAppSelector((state) => state.cartDetail);
  const cartItems = cartDetail?.cart;
  const selectedShippingRate = cartItems?.selectedShippingRate;
   const selectedShippingRateTitle = cartItems?.selectedShippingRateTitle || cartItems?.selectedShippingRate;
  // const selectedShippingRateTitle =  cartItems?.selectedShippingRate;
  const selectedPayment = cartItems?.paymentMethod;
  const selectedPaymentTitle = cartItems?.paymentMethodTitle;
  const [isOpen, setIsOpen] = useState(!selectedPayment);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedPayment) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
    }
  }, [selectedPayment]);

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between lg:flex-row lg:justify-between">
        <div className="w-full px-0 py-2 sm:px-4 sm:py-4 lg:w-1/2 xl:px-16">
          {isLoading ? (
            <CheckoutSkeleton />
          ) : (
            <Stepper
              billingAddress={billingAddress}
              currentStep={step}
              selectedPayment={selectedPayment}
              selectedPaymentTitle={selectedPaymentTitle}
              selectedShippingRate={selectedShippingRate}
              selectedShippingRateTitle={selectedShippingRateTitle}
              shippingAddress={shippingAddress}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            />
          )}
        </div>

        <div className="h-full w-full justify-self-start border-0 border-l border-none border-black/[10%] dark:border-neutral-700 lg:w-1/2 lg:border-solid">
          {isLoading ? (
            <CartSkeleton className="w-full" />
          ) : (
            <div className="max-h-auto w-full flex-initial flex-shrink-0 flex-grow-0 lg:sticky lg:top-0">
              <CheckoutCart cartItems={cartItems} selectedShippingRate={selectedShippingRate} />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CheckOut;
