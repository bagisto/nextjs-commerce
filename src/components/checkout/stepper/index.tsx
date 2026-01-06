import Link from "next/link";
import { useMemo } from "react";
import LogoIcon from "@components/common/icons/LogoIcon";
import Email from "./Email";
import { GuestAddAdressForm } from "./GuestAddAdressForm";
import Shipping from "./shipping";
import Payment from "./payment";
import Review from "./review";



const { SITE_NAME } = process.env;

interface Step {
  id: number;
  key: string;
  title: string;
  href: string;
  component: React.ReactNode;
}

interface CheckOutProps {
  billingAddress?: any;
  shippingAddress?: any;
  currentStep: string;
  selectedPayment?: any;
  selectedPaymentTitle?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  selectedShippingRate?: any;
  selectedShippingRateTitle?: string;
}

export default function Stepper(
  {
    billingAddress,
    shippingAddress,
    selectedShippingRate,
    selectedShippingRateTitle,
    selectedPayment,
    selectedPaymentTitle,
    currentStep,
    isOpen,
    setIsOpen
  }: CheckOutProps
) {
   // eslint-disable-next-line react-hooks/exhaustive-deps
  const steps = useMemo<Step[]>(() => {
    return [
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
          />
      },
      {
        id: 3,
        key: "shipping",
        title: "Shipping",
        href: "/checkout?step=address",
        component: <Shipping
          selectedShippingRate={selectedShippingRate}
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
            isOpen={isOpen}
            setIsOpen={setIsOpen}
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
          />
        ),
      },
    ];
  }, [
    billingAddress,
    shippingAddress,
    selectedShippingRate,
    selectedPayment,
    isOpen,
    setIsOpen
  ]);

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const StepItem = ({ step }: { step: Step }) => {
    const isActive = step.key === currentStep;
    const isCompleted = step.id <= (steps[currentStepIndex]?.id || 1);

    return (
      <div key={step.id} className="flex w-full flex-col">
        <div className="flex items-center justify-between font-outfit">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${isCompleted
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-neutral-900"
                }`}
            >
              {step.id}
            </div>
            <span
              className={`text-lg font-medium max-md:text-base ${isActive
                  ? "font-medium text-neutral-900 dark:text-neutral-300"
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
  };

  return (
    <div className="mx-auto w-full">
      <header className="pb-6 sm:py-6">
        <Link
          aria-label={SITE_NAME}
          className="flex items-center gap-2 text-black dark:text-white md:pt-1"
          href="/"
        >
          <LogoIcon />
        </Link>
      </header>

      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 dark:scrollbar-thumb-neutral-300 lg:h-[calc(100dvh-124px)] lg:overflow-hidden lg:overflow-y-auto">
        <div className="flex h-full flex-col gap-y-8 px-3">
          {steps.map((step) => (
            <StepItem key={step.id} step={step} />
          ))}
        </div>
      </div>
    </div>
  );
}
