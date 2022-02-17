import {
  getCommerceProvider,
  useCommerce as useCoreCommerce,
} from '@vercel/commerce'
import { bagistoProvider, BagistoProvider } from './provider'

export { bagistoProvider }
export type { BagistoProvider }

export const CommerceProvider = getCommerceProvider(bagistoProvider)

export const useCommerce = () => useCoreCommerce<BagistoProvider>()
