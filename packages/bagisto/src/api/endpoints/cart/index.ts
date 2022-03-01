import { createEndpoint, GetAPISchema } from '@vercel/commerce/api'
import cartEndpoint from '@vercel/commerce/api/endpoints/cart'
import addItem from './add-item'
import getCart from './get-cart'
import removeItem from './remove-item'
import updateItem from './update-item'

import type { BagistoAPI } from '../../'

export type CartAPI = GetAPISchema<BagistoAPI, any>

export type CartEndpoint = CartAPI['endpoint']

export const handlers: CartEndpoint['handlers'] = {
  getCart,
  addItem,
  removeItem,
  updateItem,
}

const cartApi = createEndpoint<CartAPI>({
  handler: cartEndpoint,
  handlers,
})

export default cartApi
