export type AddressType = "cart_billing" | "cart_shipping";

export interface CheckoutStepperProps {
  billingAddress?: MappedCheckoutAddress | null;
  shippingAddress?: MappedCheckoutAddress | null;
  currentStep: string;
  selectedPayment?: string;
  selectedPaymentTitle?: string;
  selectedShippingRate?: string;
  selectedShippingRateTitle?: string;
}

export interface GetCheckoutAddressesResponse {
  collectionGetCheckoutAddresses: CheckoutAddressConnection;
}

export interface CheckoutAddressConnection {
  edges: CheckoutAddressEdge[];
}



export interface CheckoutAddressEdge {
  node: CheckoutAddressNode;
}

export interface CheckoutAddressNode {
  id: string;
  addressType: AddressType;
  firstName: string;
  lastName: string;
  companyName?: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  email: string;
  phone: string;
  defaultAddress: boolean;
  useForShipping: boolean;
}

export interface MappedCheckoutAddress {
  firstName: string;
  lastName: string;
  companyName?: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  email: string;
  phone: string;
}

export interface CheckoutShippingMethodResult {
  success: boolean;
  id: string | null;
  message: string | null;
}

export interface CreateCheckoutShippingMethodPayload {
  checkoutShippingMethod: CheckoutShippingMethodResult;
}

export interface CreateCheckoutShippingMethodData {
  createCheckoutShippingMethod: CreateCheckoutShippingMethodPayload;
}

export interface CreateCheckoutShippingMethodOperation {
  data: CreateCheckoutShippingMethodData;
  variables: CreateCheckoutShippingMethodVariables;
}

export interface CreateCheckoutShippingMethodVariables {
  shippingMethod: string;
}

export interface SelectedPaymentType {
  method: string;
  methodTitle?: string;
}

export interface SelectedShippingRateType {
  method: string;
  methodDescription?: string;
}




export interface CheckoutPaymentMethod {
  id: string;
  _id: string;
  method: string;
  title: string;
  description: string | null;
  icon: string | null;
  isAllowed: boolean;
}

export interface CheckoutPaymentMethodsData {
  collectionPaymentMethods: CheckoutPaymentMethod[];
}
export interface CheckoutPaymentMethodsOperation {
  variables: Record<string, unknown>;
  data: CheckoutPaymentMethodsData;
}


export interface CreateCheckoutPaymentMethodVariables {
  paymentMethod: string;
  successUrl?: string | null;
  failureUrl?: string | null;
  cancelUrl?: string | null;
}

export interface CheckoutPaymentMethod {
  success: boolean;
  message: string;
  paymentGatewayUrl: string | null;
  paymentData: unknown;
}

export interface CreateCheckoutPaymentMethodResponse {
  createCheckoutPaymentMethod: {
    checkoutPaymentMethod: CheckoutPaymentMethod;
  };
}

export interface CreateCheckoutPaymentMethodOperation {
  data: CreateCheckoutPaymentMethodResponse;
  variables: CreateCheckoutPaymentMethodVariables;
}


export interface CheckoutShippingRate {
  id: string;
  code: string;
  description: string | null;
  method: string;
  price: number;
  label: string;
}

export interface GetCheckoutShippingRatesData {
  collectionShippingRates: CheckoutShippingRate[];
}

export interface GetCheckoutShippingRatesVariables {
  token: string;
}

export interface GetCheckoutShippingRatesOperation {
  data: GetCheckoutShippingRatesData;
  variables: GetCheckoutShippingRatesVariables;
}


export interface CheckoutOrder {
  id: string;
  orderId: string;
}
export interface CreateCheckoutOrderPayload {
  checkoutOrder: CheckoutOrder;
}
export interface CreateCheckoutOrderData {
  createCheckoutOrder: CreateCheckoutOrderPayload;
}
export interface CreateCheckoutOrderOperation {
  data: CreateCheckoutOrderData;
}

export interface CheckoutAddress {
  id: string;
  addressType: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  email: string;
  phone: string;
  defaultAddress: boolean;
  useForShipping: boolean;
}

export interface CheckoutAddressesConnection {
  edges: CheckoutAddressEdge[];
}
export interface GetCheckoutAddressesData {
  collectionGetCheckoutAddresses: CheckoutAddressesConnection;
}
export interface GetCheckoutAddressesOperation {
  data: GetCheckoutAddressesData;
}

export interface CheckoutAddressResult {
  id: string;
  _id: string;
  cartToken: string;

  success: boolean;
  message: string;

  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPostcode: string;
  billingPhoneNumber: string;

  shippingFirstName: string | null;
  shippingLastName: string | null;
  shippingCity: string | null;
  shippingCompanyName: string | null;
}
export interface CreateCheckoutAddressPayload {
  checkoutAddress: CheckoutAddressResult;
}
export interface CreateCheckoutAddressData {
  createCheckoutAddress: CreateCheckoutAddressPayload;
}
export interface CreateCheckoutAddressVariables {
  billingFirstName: string;
  billingLastName: string;
  billingEmail: string;
  billingAddress: string;
  billingCity: string;
  billingCountry: string;
  billingState: string;
  billingPostcode: string;
  billingPhoneNumber: string;
  billingCompanyName: string;

  useForShipping?: boolean;

  shippingFirstName?: string;
  shippingLastName?: string;
  shippingEmail?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingCountry?: string;
  shippingState?: string;
  shippingPostcode?: string;
  shippingPhoneNumber?: string;
  shippingCompanyName?: string;
}
export interface CreateCheckoutAddressOperation {
  data: CreateCheckoutAddressData;
  variables: CreateCheckoutAddressVariables;
}

