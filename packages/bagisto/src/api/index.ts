import { getCommerceApi as commerceApi } from '@vercel/commerce/api'
import getAllPages from './operations/get-all-pages'
import getAllProductPaths from './operations/get-all-product-paths'
import getAllProducts from './operations/get-all-products'
import getCustomerWishlist from './operations/get-customer-wishlist'
import getPage from './operations/get-page'
import getProduct from './operations/get-product'
import getOrder from './operations/get-order'
import getSiteInfo from './operations/get-site-info'
import login from './operations/login'
import graphqlFetcher from './utils/fetch/fetch-graphql-api'
import { API_URL, CURRENCY_CODE, CUSTOMER_COOKIE, GUEST_COOKIE } from '../const'

import type { CommerceAPI, CommerceAPIConfig } from '@vercel/commerce/api'

export interface BagistoCommerceConfig extends CommerceAPIConfig {
  currencyCode: string
  guestCookie: string
}

export interface BagistoConfig extends BagistoCommerceConfig {}

const config: BagistoConfig = {
  apiToken: '',
  cartCookie: '',
  cartCookieMaxAge: 2592000,
  commerceUrl: API_URL,
  currencyCode: CURRENCY_CODE,
  guestCookie: GUEST_COOKIE,
  customerCookie: CUSTOMER_COOKIE,
  fetch: graphqlFetcher(() => getCommerceApi().getConfig()),
}

const operations = {
  login,
  getAllPages,
  getPage,
  getSiteInfo,
  getCustomerWishlist,
  getAllProductPaths,
  getAllProducts,
  getProduct,
  getOrder,
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
