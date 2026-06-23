"use client";

import { Controller, FieldValues, useForm } from "react-hook-form";
import { RadioGroup } from "@heroui/react";
import { useState } from "react";
import { useCustomToast } from "@utils/hooks/useToast";
import { useCheckout } from "@utils/hooks/useCheckout";
import { ProceedToCheckout } from "../ProceedToCheckout";
import { CustomRadio } from "@components/checkout/CustomRadio";
import { useDispatch } from "react-redux";
import { updateCart } from "@/store/slices/cart-slice";
import type { CheckoutPaymentMethod } from "@/types/checkout/type";

export default function PaymentMethod({
  selectedPayment,
  methods,
  currentStep,
}: {
  selectedPayment?: string;
  methods?: CheckoutPaymentMethod[];
  currentStep?: string;
}) {
  const { showToast } = useCustomToast();
  const { isPaymentLoading, saveCheckoutPayment } = useCheckout();
  const [isOpen, setIsOpen] = useState(currentStep !== "payment");

  const [prevValues, setPrevValues] = useState({
    currentStep,
    selectedPayment,
  });

  if (
    currentStep !== prevValues.currentStep ||
    selectedPayment !== prevValues.selectedPayment
  ) {
    setPrevValues({ currentStep, selectedPayment });
    if (currentStep === "payment") {
      setIsOpen(false);
    } else if (selectedPayment) {
      setIsOpen(true);
    }
  }

  const { handleSubmit, control } = useForm({
    mode: "onSubmit",
    defaultValues: {
      method: selectedPayment ?? "",
    },
  });

  const selectedMethodLabelPrior = methods?.find(
    (method) => method?.method === selectedPayment,
  )?.title;

  const dispatch = useDispatch();
  const onSubmit = async (data: FieldValues) => {
    if (!data?.method) {
      showToast("Please Choose the Payment Method", "warning");
      return;
    }
    try {
      const selectedMethod = methods?.find((m) => m?.method === data?.method);
      if (selectedMethod) {
        dispatch(
          updateCart({
            paymentMethod: selectedMethod?.method || "",
            paymentMethodTitle: selectedMethod?.title || "",
          }),
        );
      }
      await saveCheckoutPayment(data.method);
    } catch {
      showToast("Failed to save payment method. Please try again.");
    }
  };

  const methodForm = (
    <div className="mt-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="method"
          render={({ field }) => (
            <RadioGroup
              {...field}
              label=""
              value={field.value ?? ""}
              onValueChange={field.onChange}
            >
              {methods?.map((method) => (
                <CustomRadio
                  key={method?.method}
                  className="my-1 border border-solid border-neutral-300 dark:border-neutral-500"
                  description={method?.description ?? undefined}
                  value={method?.method}
                >
                  <span className="text-neutral-700 dark:text-white">
                    {method?.title}
                  </span>
                </CustomRadio>
              ))}
            </RadioGroup>
          )}
        />

        <div className="my-6 justify-self-end">
          <ProceedToCheckout buttonName="Pay Now" pending={isPaymentLoading} />
        </div>
      </form>
    </div>
  );

  if (selectedPayment && isOpen) {
    return (
      <>
        <div className="mt-4 justify-between hidden sm:flex">
          <div className="flex">
            <p className="w-auto text-base font-normal text-black/60 dark:text-selected-white sm:w-[192px]">
              Payment Method
            </p>
            <p className="text-base font-normal">{selectedMethodLabelPrior}</p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer text-base font-normal text-black/60 underline dark:text-selected-white"
          >
            Change
          </button>
        </div>
        <div className="mt-4 flex sm:hidden justify-between relative">
          <div className="flex justify-between flex-1 wrap">
            <p className="w-auto text-base font-normal text-black/60 dark:text-selected-white sm:w-[192px]">
              Payment Method
            </p>
            <p className="text-base font-normal">{selectedMethodLabelPrior}</p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer absolute right-0 text-base font-normal text-black/60 underline dark:text-selected-white"
            style={{ top: "-36px" }}
          >
            Change
          </button>
        </div>
      </>
    );
  }

  return methodForm;
}
