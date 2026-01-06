import { Radio } from "@heroui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export type CustomRadioProps = {
  children: React.ReactNode;
  description?: string;
  value: string;
} & typeof Radio.defaultProps;

export type ShippingMethodType = {
  method?: string;
  label?: string;
  price?: number | string;
  code?: string;
};

export type EmailFormValues = { email: string };

export type EmailFormProps = {
  register: UseFormRegister<EmailFormValues>;
  errors: FieldErrors<EmailFormValues>;
  isSubmitting: boolean;
  isGuest: boolean;
};