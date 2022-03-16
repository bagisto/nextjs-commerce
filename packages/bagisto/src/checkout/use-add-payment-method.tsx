import { useCallback } from 'react'
import useAddPaymentMethod, {
  UseAddPaymentMethod,
} from '@vercel/commerce/checkout/use-add-payment-method'

import useCheckout from './use-checkout'

import type { MutationHook } from '@vercel/commerce/utils/types'

export default useAddPaymentMethod as UseAddPaymentMethod<typeof handler>

export const handler: MutationHook<any> = {
  fetchOptions: {
    url: '/api/checkout/add-payment-method',
    method: 'POST',
  },

  async fetcher({ input: { paymentMethod }, options, fetch }) {
    const data = await fetch({
      ...options,
      body: { paymentMethod },
    })

    return data
  },

  useHook: ({ fetch }) =>
    function useHook() {
      const { mutate } = useCheckout()

      return useCallback(
        async function addPaymentMethod(input) {
          const data = await fetch({ input })

          await mutate([data], false)

          return data
        },
        [fetch, mutate]
      )
    },
}
