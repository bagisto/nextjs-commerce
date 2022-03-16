import { useCallback } from 'react'
import useAddAddresses, {
  UseAddAddresses,
} from '@vercel/commerce/checkout/use-add-addresses'

import useCheckout from './use-checkout'

import type { MutationHook } from '@vercel/commerce/utils/types'

export default useAddAddresses as UseAddAddresses<typeof handler>

export const handler: MutationHook<any> = {
  fetchOptions: {
    url: '/api/checkout/add-addresses',
    method: 'POST',
  },

  async fetcher({ input: { addresses }, options, fetch }) {
    const data = await fetch({
      ...options,
      body: { addresses },
    })

    return data
  },

  useHook: ({ fetch }) =>
    function useHook() {
      const { mutate } = useCheckout()

      return useCallback(
        async function addAddresses(input) {
          const data = await fetch({ input })

          await mutate([data], false)

          return data
        },
        [fetch, mutate]
      )
    },
}
