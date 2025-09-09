"use client";

import { Controller, FieldValues, useForm } from "react-hook-form";
import { cn, Radio, RadioGroup } from "@heroui/react";
import { useCheckout } from "@/components/hooks/use-checkout";
import { ProceedToCheckout } from "@/components/checkout/cart/proceed-to-checkout";
import WalletLogo from "@/components/icons/wallet-logo";
import { selectedPaymentMethodType } from "@/lib/bagisto/types";
import { isArray, isObject } from "@/lib/type-guards";
import { useCustomToast } from "@/components/hooks/use-toast";
import { useState } from "react";

type CustomRadioProps = {
  children: React.ReactNode;
  description?: string;
  value: string;
} & typeof Radio.defaultProps;

export default function PaymentMethod({
  selectedPayment,
  methods,
}: {
  selectedPayment?: selectedPaymentMethodType;
  methods: {
    method: string;
    methodTitle: string;
    description?: string;
    sort?: number;
  }[];
}) {
  const { showToast } = useCustomToast();
  const [isOpen, setIsOpen] = useState(true);
  const { handleSubmit, control } = useForm({
    mode: "onSubmit",
    defaultValues: {
      method: selectedPayment?.method || "",
    },
  });

  const { isPaymentLoading, saveCheckoutPayment } = useCheckout();

  const onSubmit = async (data: FieldValues) => {
    if (!data?.method) {
      showToast("Please Choose the Payment Method", "warning");

      return;
    }
    saveCheckoutPayment(data);
  };

  return isObject(selectedPayment) ? (
    isOpen ? (
      <div className="mt-4 flex justify-between">
        <div className="flex">
          <p className="w-auto text-base font-normal text-black/60 dark:text-white/60 sm:w-[192px]">
            Payment Method
          </p>
          <p className="text-base font-normal">
            {selectedPayment?.methodTitle}
          </p>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer text-base font-normal text-black/[60%] underline dark:text-neutral-300"
        >
          Change
        </button>
      </div>
    ) : (
      <div className="mt-6">
        {isArray(methods) ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="method"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  label=""
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {methods.map((method) => (
                    <CustomRadio
                      key={method?.method}
                      className="my-1 border border-solid border-neutral-300 dark:border-neutral-500"
                      description={method?.description}
                      value={method?.method}
                    >
                      <span className="text-neutral-700 dark:text-white">
                        {method?.methodTitle}
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
        ) : (
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Payment</h1>
            <p className="text-neutral-500">
              All transactions are secure and encrypted.
            </p>
            <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl bg-neutral-100 px-3 dark:bg-neutral-950">
              <WalletLogo className="text-neutral-400" />
              <p className="text-center text-neutral-500">
                This store can’t accept payments right now.
              </p>
            </div>
          </div>
        )}
      </div>
    )
  ) : (
    <div className="mt-6">
      {isArray(methods) ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="method"
            render={({ field }) => (
              <RadioGroup
                {...field}
                label=""
                value={field.value}
                onValueChange={field.onChange}
              >
                {methods.map((method) => (
                  <CustomRadio
                    key={method?.method}
                    className="my-1 border border-solid border-neutral-300 dark:border-neutral-500"
                    description={method?.description}
                    value={method?.method}
                  >
                    <span className="text-neutral-700 dark:text-white">
                      {method?.methodTitle}
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
      ) : (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Payment</h1>
          <p className="text-neutral-500">
            All transactions are secure and encrypted.
          </p>
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl bg-neutral-100 px-3 dark:bg-neutral-700">
            <WalletLogo className="text-neutral-400" />
            <p className="text-center text-neutral-500 dark:text-white/75">
              This store can’t accept payments right now.
            </p>
          </div>
        </div>
      )}
    </div>
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
