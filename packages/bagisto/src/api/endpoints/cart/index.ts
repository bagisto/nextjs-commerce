import { createEndpoint, GetAPISchema } from '@vercel/commerce/api'
import cartEndpoint from '@vercel/commerce/api/endpoints/cart'
import getCart from './get-cart'
import addItem from './add-item'

import type { BagistoAPI } from '../../'

export type CartAPI = GetAPISchema<BagistoAPI, any>

export type CartEndpoint = CartAPI['endpoint']

export const handlers: CartEndpoint['handlers'] = {
  getCart,
  addItem,
}

const cartApi = createEndpoint<CartAPI>({
  handler: cartEndpoint,
  handlers,
})

export default cartApi
