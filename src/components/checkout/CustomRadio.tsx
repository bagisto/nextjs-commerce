"use client";

import { cn, Radio } from "@heroui/react";
import { CustomRadioProps } from "@components/checkout/type";


export const CustomRadio = (props: CustomRadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-transparent hover:bg-transparent items-center",
          "flex-row items-baseline max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
        hiddenInput: "peer absolute h-0 w-0 opacity-0",
      }}
    >
      {children}
    </Radio>
  );
};
