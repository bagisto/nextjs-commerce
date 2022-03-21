import { GetAPISchema, createEndpoint } from '@vercel/commerce/api'
import orderEndpoint from '@vercel/commerce/api/endpoints/order'

import getOrders from './get-orders'

export type OrderAPI = GetAPISchema<any>
export type OrderEndpoint = OrderAPI['endpoint']

export const handlers: OrderEndpoint['handlers'] = {
  getOrders,
}

const orderApi = createEndpoint<OrderAPI>({
  handler: orderEndpoint,
  handlers,
})

export default orderApi
