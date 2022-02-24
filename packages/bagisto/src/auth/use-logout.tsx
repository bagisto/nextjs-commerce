import { useCallback } from 'react'

import useLogout, { UseLogout } from '@vercel/commerce/auth/use-logout'

import useCustomer from '../customer/use-customer'

import type { MutationHook } from '@vercel/commerce/utils/types'
import type { LogoutHook } from '../type/logout'

export default useLogout as UseLogout<typeof handler>

export const handler: MutationHook<LogoutHook> = {
  fetchOptions: {
    url: '/api/logout',
    method: 'GET',
  },
  useHook:
    ({ fetch }) =>
    () => {
      const { mutate } = useCustomer()

      return useCallback(
        async function logout() {
          const data = await fetch()
          await mutate(null, false)
          return data
        },
        [fetch, mutate]
      )
    },
}
