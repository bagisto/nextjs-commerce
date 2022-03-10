import type { UseSubmitCheckout } from '../checkout/use-submit-checkout'
import type { Address, AddressFields } from './customer/address'
import type { Card, CardFields } from './customer/card'

export type Checkout = any

export type CheckoutTypes = {
  card?: Card | CardFields
  address?: Address | AddressFields
  checkout?: Checkout
  hasPayment?: boolean
  hasShipping?: boolean
}

export type AddShippingMethodHook<T extends CheckoutTypes = CheckoutTypes> = {
  data: T
  input?: T
  fetcherInput: T
  body: { item: T }
  actionInput: T
}

export type AddPaymentMethodHook<T extends CheckoutTypes = CheckoutTypes> = {
  data: T
  input?: T
  fetcherInput: T
  body: { item: T }
  actionInput: T
}

export type GetCheckoutHook<T extends CheckoutTypes = CheckoutTypes> = {
  data: T['checkout'] | null
  input: {}
  fetcherInput: { cartId?: string }
  swrState: { isEmpty: boolean }
  mutations: { submit: UseSubmitCheckout }
}

export type SubmitCheckoutHook<T extends CheckoutTypes = CheckoutTypes> = {
  data: T
  input?: T
  fetcherInput: T
  body: { item: T }
  actionInput: T
}

export type CheckoutHooks<T extends CheckoutTypes = CheckoutTypes> = {
  addShippingMethod?: AddShippingMethodHook<T>
  addPaymentMethod?: AddPaymentMethodHook<T>
  submitCheckout?: SubmitCheckoutHook<T>
  getCheckout: GetCheckoutHook<T>
}

export type GetCheckoutHandler<T extends CheckoutTypes = CheckoutTypes> =
  GetCheckoutHook<T> & {
    body: { cartId: string }
  }

export type AddShippingMethodHandler<T extends CheckoutTypes = CheckoutTypes> =
  AddShippingMethodHook<T> & {
    body: {
      cartId: string
      shippingMethod: string
    }
  }

export type AddPaymentMethodHandler<T extends CheckoutTypes = CheckoutTypes> =
  AddPaymentMethodHook<T> & {
    body: {
      cartId: string
      paymentMethod: string
    }
  }

export type SubmitCheckoutHandler<T extends CheckoutTypes = CheckoutTypes> =
  SubmitCheckoutHook<T> & {
    body: { cartId: string }
  }

export type CheckoutHandlers<T extends CheckoutTypes = CheckoutTypes> = {
  getCheckout: GetCheckoutHandler<T>
  addShippingMethod: AddShippingMethodHandler<T>
  addPaymentMethod: AddPaymentMethodHandler<T>
  submitCheckout?: SubmitCheckoutHandler<T>
}

export type CheckoutSchema<T extends CheckoutTypes = CheckoutTypes> = {
  endpoint: {
    options: {}
    handlers: CheckoutHandlers<T>
  }
}
