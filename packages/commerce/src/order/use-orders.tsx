import { useHook, useSWRHook } from '../utils/use-hook'
import { SWRFetcher } from '../utils/default-fetcher'

import type { HookFetcherFn, SWRHook } from '../utils/types'
import type { Provider } from '..'

export type UseOrders<H extends SWRHook<any> = SWRHook<any>> = ReturnType<
  H['useHook']
>

export const fetcher: HookFetcherFn<any> = SWRFetcher

const fn = (provider: Provider) => provider.order?.useOrders!

const useOrders: UseOrders = (input) => {
  const hook = useHook(fn)
  return useSWRHook({ fetcher, ...hook })(input)
}

export default useOrders
