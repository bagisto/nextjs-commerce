
export interface PaymentMethod {
  method: string;
  title: string;
  description?: string;
  sort?: number;
}

export interface ShippingMethod {
  code: string;
  method: string;
  label: string;
  price: number;
  basePrice?: number;
  formattedPrice?: string;
}

export interface CheckoutAddress {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  state: string;
  postcode: string;
  phoneNumber: string;
  companyName?: string;
}

export interface BillingAddress extends CheckoutAddress {
  useForShipping?: boolean;
}

export type ShippingAddress = CheckoutAddress;

export interface CheckoutStepperProps {
  billingAddress?: BillingAddress;
  shippingAddress?: ShippingAddress;
  currentStep: string;
  selectedPayment?: string;
  selectedPaymentTitle?: string;
  selectedShippingRate?: string;
  selectedShippingRateTitle?: string;
}

export type CheckOutProps = CheckoutStepperProps;
