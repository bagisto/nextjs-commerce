import { SWRHook } from '@vercel/commerce/utils/types'
import useOrders, { UseOrders } from '@vercel/commerce/order/use-orders'

export default useOrders as UseOrders<typeof handler>

export const handler: SWRHook<any> = {
  fetchOptions: {
    method: 'GET',
    url: '/api/orders',
  },

  async fetcher({ options, fetch }) {
    return await fetch({ ...options })
  },

  useHook:
    ({ useData }) =>
    (input) => {
      return useData({
        swrOptions: {
          revalidateOnFocus: false,
          ...input?.swrOptions,
        },
      })
    },
}
