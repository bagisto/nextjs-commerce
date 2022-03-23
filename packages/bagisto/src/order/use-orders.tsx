import { SWRHook } from '@vercel/commerce/utils/types'
import useOrders, { UseOrders } from '@vercel/commerce/order/use-orders'

export default useOrders as UseOrders<typeof handler>

export const handler: SWRHook<any> = {
  fetchOptions: {
    method: 'POST',
    url: '/api/orders',
  },

  async fetcher({ input: { orderId, page }, options, fetch }) {
    return fetch({
      ...options,
      body: { orderId, page },
    })
  },

  useHook:
    ({ useData }) =>
    (input) => {
      return useData({
        input: [
          ['orderId', input?.orderId],
          ['page', input?.page],
        ],
        swrOptions: {
          revalidateOnFocus: false,
          ...input?.swrOptions,
        },
      })
    },
}
