import { useCallback } from 'react'
import useAddShippingMethod, {
  UseAddShippingMethod,
} from '@vercel/commerce/checkout/use-add-shipping-method'

import useCheckout from './use-checkout'

import type { MutationHook } from '@vercel/commerce/utils/types'

export default useAddShippingMethod as UseAddShippingMethod<typeof handler>

export const handler: MutationHook<any> = {
  fetchOptions: {
    url: '/api/checkout/add-shipping-method',
    method: 'POST',
  },

  async fetcher({ input: { shippingMethod }, options, fetch }) {
    const data = await fetch({
      ...options,
      body: { shippingMethod },
    })

    return data
  },

  useHook: ({ fetch }) =>
    function useHook() {
      const { mutate } = useCheckout()

      return useCallback(
        async function addShippingMethod(input) {
          const data = await fetch({ input })

          await mutate([data], false)

          return data
        },
        [fetch, mutate]
      )
    },
}
