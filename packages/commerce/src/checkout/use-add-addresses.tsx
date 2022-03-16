import { useHook, useMutationHook } from '@vercel/commerce/utils/use-hook'
import { mutationFetcher } from '@vercel/commerce/utils/default-fetcher'

import type { Provider } from '@vercel/commerce'
import type { HookFetcherFn, MutationHook } from '@vercel/commerce/utils/types'

export type UseAddAddresses<H extends MutationHook<any> = MutationHook<any>> =
  ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<any> = mutationFetcher

const fn = (provider: Provider) => provider.checkout?.useAddAddresses!

const useAddAddresses: UseAddAddresses = (...args) => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })(...args)
}

export default useAddAddresses
