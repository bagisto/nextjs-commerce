import type { CommerceAPI, CommerceAPIConfig } from '@vercel/commerce/api'
import { getCommerceApi as commerceApi } from '@vercel/commerce/api'
import graphqlFetcher from './utils/graphql-api/fetch'

import getAllPages from './operations/get-all-pages'
import getPage from './operations/get-page'
import getSiteInfo from './operations/get-site-info'
import getCustomerWishlist from './operations/get-customer-wishlist'
import getAllProductPaths from './operations/get-all-product-paths'
import getAllProducts from './operations/get-all-products'
import getProduct from './operations/get-product'

export interface BagistoCommerceConfig extends CommerceAPIConfig {
  currencyCode: string
}

export interface BagistoConfig extends BagistoCommerceConfig {}
const config: BagistoConfig = {
  apiToken: '',
  cartCookie: '',
  cartCookieMaxAge: 2592000,
  commerceUrl:
    'http://192.168.15.114/modules/headless-ecommerce/public/graphql',
  currencyCode: 'USD',
  customerCookie: '',
  fetch: graphqlFetcher(() => getCommerceApi().getConfig()),
}

const operations = {
  getAllPages,
  getPage,
  getSiteInfo,
  getCustomerWishlist,
  getAllProductPaths,
  getAllProducts,
  getProduct,
}

export const provider = { config, operations }

export type BagistoProvider = typeof provider
export type BagistoAPI<P extends BagistoProvider = BagistoProvider> =
  CommerceAPI<P | any>

export function getCommerceApi<P extends BagistoProvider>(
  customProvider: P = provider as any
): BagistoAPI<P> {
  return commerceApi(customProvider as any)
}
