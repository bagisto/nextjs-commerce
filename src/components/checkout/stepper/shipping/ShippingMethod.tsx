"use client";

import { FieldValues, useForm, Controller } from "react-hook-form";
import { RadioGroup } from "@heroui/react";
import { useState } from "react";
import { ProceedToCheckout } from "../ProceedToCheckout";
import { useCustomToast } from "@utils/hooks/useToast";
import { useCheckout } from "@utils/hooks/useCheckout";
import { CustomRadio } from "@components/checkout/CustomRadio";
import { ShippingMethodType } from "@components/checkout/type";
import { useDispatch } from "react-redux";
import { updateCart } from "@/store/slices/cart-slice";

export default function ShippingMethod({
  shippingMethod,
  selectedShippingRate,
  currentStep,
}: {
  shippingMethod?: ShippingMethodType[];
  selectedShippingRate?: string;
  methodDesc?: string;
  currentStep?: string;
}) {
  const { isSaving, saveCheckoutShipping } = useCheckout();
  const { showToast } = useCustomToast();
  const [isOpen, setIsOpen] = useState(currentStep !== "shipping");

  const [prevValues, setPrevValues] = useState({
    currentStep,
    selectedShippingRate,
  });

  if (
    currentStep !== prevValues.currentStep ||
    selectedShippingRate !== prevValues.selectedShippingRate
  ) {
    setPrevValues({ currentStep, selectedShippingRate });
    if (currentStep === "shipping") {
      setIsOpen(false);
    } else if (selectedShippingRate) {
      setIsOpen(true);
    }
  }

  const { control, handleSubmit } = useForm({
    mode: "onSubmit",
    defaultValues: {
      method: selectedShippingRate ?? "",
    },
  });

  const selectedMethod = shippingMethod?.find(
    (method) => method.method === selectedShippingRate,
  );
  const selectedMethodTitle = selectedMethod?.label;
  const selectedMethodPrice = selectedMethod?.price;

  const dispatch = useDispatch();
  const onSubmit = async (data: FieldValues) => {
    if (!data?.method) {
      showToast("Please Choose the Shipping Method", "warning");
      return;
    }
    try {
      const selectedRate = shippingMethod?.find((m) => m.method === data.method);
      if (selectedRate) {
        dispatch(
          updateCart({
            shippingMethod: selectedRate?.method || "",
            selectedShippingRate: selectedRate?.method || "",
            selectedShippingRateTitle: selectedRate?.label || "",
          }),
        );
      }
      await saveCheckoutShipping(data?.method);
    } catch {
      showToast("Failed to save shipping method. Please try again.");
    }
  };

  const methodForm = (
    <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5">
        {Array.isArray(shippingMethod) && (
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
                {shippingMethod.map((method) => (
                  <CustomRadio
                    key={method?.code}
                    className="inset-0 my-1 border border-solid border-neutral-300 dark:border-neutral-500"
                    description={"$" + method?.price}
                    value={method?.method ?? ""}
                  >
                    <span className="text-neutral-700 dark:text-white">
                      {method?.label}
                    </span>
                  </CustomRadio>
                ))}
              </RadioGroup>
            )}
          />
        )}
      </div>

      <div className="my-6 justify-self-end">
        <ProceedToCheckout buttonName="Next" pending={isSaving} />
      </div>
    </form>
  );

  if (selectedShippingRate && isOpen) {
    return (
      <div>
        <div className="mt-4 justify-between hidden sm:flex">
          <div className="flex">
            <p className="w-auto text-base font-normal text-black/60 dark:text-selected-white sm:w-[192px]">
              Shipping Method
            </p>
            <p className="text-base font-normal">
              {selectedMethodTitle} (${selectedMethodPrice})
            </p>
          </div>
          <div className="flex">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer text-base font-normal text-black/[60%] underline dark:text-selected-white"
            >
              Change
            </button>
          </div>
        </div>

        <div className="mt-4 block sm:hidden flex flex-col justify-between sm:flex-row relative">
          <div className="flex justify-between flex-1 wrap">
            <p className="w-auto text-base font-normal text-black/60 dark:text-selected-white sm:w-[192px]">
              Shipping Method
            </p>
            <p className="text-base font-normal">
              {selectedMethodTitle} (${selectedMethodPrice})
            </p>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer absolute right-0 text-base font-normal text-black/[60%] underline dark:text-selected-white"
            style={{ top: "-36px" }}
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return <div>{methodForm}</div>;
}
