export type AddressType = "cart_billing" | "cart_shipping";

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
}

export interface CreateCheckoutShippingMethodVariables {
  token: string;
  shippingMethod: string;
}



 export interface SelectedPaymentType {
    method: string;
    methodTitle?: string;
  };


  export interface SelectedShippingRateType {
    method: string;
    methodDescription?: string;
  };



  // Checkout Payment Methods

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
export interface CheckoutPaymentMethodsVariables {
  token: string;
}
export interface CheckoutPaymentMethodsOperation {
  data: CheckoutPaymentMethodsData;
  variables: CheckoutPaymentMethodsVariables;
}


// Checkout Place Order

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
export interface CreateCheckoutOrderVariables {
  token: string;
}

export interface CreateCheckoutOrderOperation {
  data: CreateCheckoutOrderData;
  variables: CreateCheckoutOrderVariables;
}

// Checkout Get Address
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
export interface GetCheckoutAddressesVariables {
  token: string;
}
export interface GetCheckoutAddressesOperation {
  data: GetCheckoutAddressesData;
  variables: GetCheckoutAddressesVariables;
}

// checkout save address
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
  token: string;

  // Billing
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

  // Shipping control
  useForShipping?: boolean;

  // Shipping (optional when useForShipping === true)
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


// checkout save payment
