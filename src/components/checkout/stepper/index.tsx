"use client";
import Link from "next/link";
import { useMemo } from "react";
import LogoIcon from "@components/common/icons/LogoIcon";
import Email from "./Email";
import { GuestAddAdressForm } from "./GuestAddAdressForm";
import Shipping from "./shipping";
import Payment from "./payment";
import Review from "./review";
import { isShippingRequired } from "@/utils/helper";
import { useAppSelector } from "@/store/hooks";
import type { CheckoutStepperProps } from "@/types/checkout/type";

interface Step {
  id: number;
  key: string;
  title: string;
  href: string;
  component: React.ReactNode;
}

function StepItem({
  step,
  currentStep,
  isCompleted,
}: {
  step: Step;
  currentStep: string;
  isCompleted: boolean;
}) {
  const isActive = step.key === currentStep;

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between font-outfit">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${
              isCompleted ? "bg-primary text-white" : "bg-gray-200 text-neutral-900"
            }`}
          >
            {step.id}
          </div>
          <span
            className={`text-lg font-medium max-md:text-base ${
              isActive
                ? "font-medium text-neutral-900 dark:text-selected-white"
                : "text-neutral-900 dark:text-white"
            }`}
          >
            {step.title}
          </span>
        </div>
      </div>

      {isCompleted && <section className="relative">{step.component}</section>}
    </div>
  );
}

export default function Stepper({
  billingAddress,
  shippingAddress,
  selectedShippingRate,
  selectedShippingRateTitle,
  selectedPayment,
  selectedPaymentTitle,
  currentStep,
}: CheckoutStepperProps) {
  const cart = useAppSelector((state) => state.cartDetail.cart);

  const steps = useMemo<Step[]>(() => {
    const shippingRequired = isShippingRequired(cart);
    const allSteps = [
      {
        id: 1,
        key: "email",
        title: "Email",
        href: "/checkout",
        component: <Email />,
      },
      {
        id: 2,
        key: "address",
        title: "Address",
        href: "/checkout",
        component:
          <GuestAddAdressForm
            billingAddress={billingAddress}
            shippingAddress={shippingAddress}
            currentStep={currentStep}
          />
      },
      {
        id: 3,
        key: "shipping",
        title: "Shipping",
        href: "/checkout?step=address",
        component: <Shipping
          selectedShippingRate={selectedShippingRate}
          currentStep={currentStep}
        />,
      },
      {
        id: 4,
        key: "payment",
        title: "Payment",
        href: "/checkout?step=shipping",
        component: (
          <Payment
            selectedPayment={selectedPayment}
            currentStep={currentStep}
          />
        ),
      },
      {
        id: 5,
        key: "review",
        title: "Review",
        href: "/checkout?step=payment",
        component: (
          <Review
            billingAddress={billingAddress}
            selectedPaymentTitle={selectedPaymentTitle}
            selectedShippingRate={selectedShippingRate}
            selectedShippingRateTitle={selectedShippingRateTitle}
            shippingAddress={shippingAddress}
            isShippingRequired={shippingRequired}
          />
        ),
      },
    ];

    const filteredSteps = allSteps.filter(step => step.key !== 'shipping' || shippingRequired);

    return filteredSteps.map((step, index) => ({
      ...step,
      id: index + 1,
      href: (step.key === 'payment' && !shippingRequired) ? "/checkout?step=address" :
            (step.key === 'review' && !shippingRequired && currentStep === 'review') ? "/checkout?step=payment" :
            step.href
    }));
  }, [
    currentStep,
    billingAddress,
    shippingAddress,
    selectedShippingRate,
    selectedPayment,
    selectedPaymentTitle,
    selectedShippingRateTitle,
    cart
  ]);

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="mx-auto w-full">
      <header className="pb-6 sm:py-6">
        <Link
          aria-label="Go to homepage"
          className="flex items-center gap-2 text-black dark:text-white md:pt-1 hidden lg:block"
          href="/"
        >
          <LogoIcon />
        </Link>
        <h1 className="text-xl px-2 font-semibold block lg:hidden">Checkout</h1>
      </header>

      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 dark:scrollbar-thumb-neutral-300 h-[calc(100dvh-300px)] overflow-y-auto lg:h-[calc(100dvh-124px)]">
        <div className="flex h-full flex-col gap-y-8 pl-2 pr-6 sm:px-3 sm:pr-10">
          {steps.map((step) => (
            <StepItem
              key={step.id}
              step={step}
              currentStep={currentStep}
              isCompleted={step.id <= (steps[currentStepIndex]?.id || 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
