import { GetAPISchema, createEndpoint } from '@vercel/commerce/api'
import checkoutEndpoint from '@vercel/commerce/api/endpoints/checkout'

import getCheckout from './get-checkout'
import addShippingMethod from './add-shipping-method'
import submitCheckout from './submit-checkout'

import type { CheckoutSchema } from '@vercel/commerce/types/checkout'
import type { BagistoAPI } from '../../'

export type CheckoutAPI = GetAPISchema<BagistoAPI, CheckoutSchema>
export type CheckoutEndpoint = CheckoutAPI['endpoint']

export const handlers: CheckoutEndpoint['handlers'] = {
  getCheckout,
  addShippingMethod,
  submitCheckout,
}

const checkoutApi = createEndpoint<CheckoutAPI>({
  handler: checkoutEndpoint,
  handlers,
})

export default checkoutApi
