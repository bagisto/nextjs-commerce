"use client";

import { Controller, FieldValues, useForm } from "react-hook-form";
import { cn, Radio, RadioGroup } from "@heroui/react";
import { useEffect } from "react";
import { useCustomToast } from "@utils/hooks/useToast";
import { useCheckout } from "@utils/hooks/useCheckout";
import { ProceedToCheckout } from "../ProceedToCheckout";
import { CustomRadioProps } from "@components/checkout/type";

export default function PaymentMethod({
  selectedPayment,
  methods,
  isOpen,
  setIsOpen
}: {
  selectedPayment?: string;
  methods: any;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const { showToast } = useCustomToast();
  const { isPaymentLoading, saveCheckoutPayment } = useCheckout();

  const { handleSubmit, control, reset } = useForm({
    mode: "onSubmit",
    defaultValues: {
      method: selectedPayment ?? "",
    },
  });
  const selectedMethodLabelPrior = methods?.find(
    (method: any) => method?.method === selectedPayment
  )?.title;


  useEffect(() => {
    if (selectedPayment) {
      reset({ method: selectedPayment });
    }
  }, [selectedPayment, reset]);

  const onSubmit = async (data: FieldValues) => {
    if (!data?.method) {
      showToast("Please Choose the Payment Method", "warning");
      return;
    }
    try {
      await saveCheckoutPayment(data.method);
      setIsOpen(false);
    } catch {
      showToast("Failed to save payment method. Please try again.");
    }
  };
  return (
    <>
      {selectedPayment && !isOpen && (
        <>
        <div className="mt-4  justify-between hidden sm:flex ">
          <div className="flex">
            <p className="w-auto text-base font-normal text-black/60 dark:text-white/60 sm:w-[192px]">
              Payment Method
            </p>
            <p className="text-base font-normal">
              {selectedMethodLabelPrior as string}
            </p>
          </div>

          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="cursor-pointer text-base font-normal text-black/60 underline dark:text-neutral-300"
         >
            Change
          </button>
        </div>
        <div className="mt-4 flex sm:hidden justify-between relative">
          <div className="flex justify-between justify-between  flex-1 wrap">
            <p className="w-auto text-base font-normal text-black/60 dark:text-white/60 sm:w-[192px]">
              Payment Method
            </p>
            <p className="text-base font-normal">
              {selectedMethodLabelPrior as string}
            </p>
          </div>

          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="cursor-pointer absolute right-0 text-base font-normal text-black/60 underline dark:text-neutral-300"
          style={{ top: "-36px" }}
         >
            Change
          </button>
        </div>
        </>
      )}

      {isOpen && (
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
                  {methods?.map((method: any) => (
                    <CustomRadio
                      key={method?.method}
                      className="my-1 border border-solid border-neutral-300 dark:border-neutral-500"
                      description={method?.description}
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
              <ProceedToCheckout
                buttonName="Pay Now"
                pending={isPaymentLoading}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
}


const CustomRadio = (props: CustomRadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-transparent hover:bg-transparent items-center",
          "flex-row items-baseline max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
        hiddenInput: "peer absolute h-0 w-0 opacity-0",
      }}
    >
      {children}
    </Radio>
  );
};
