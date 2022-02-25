import { createEndpoint, GetAPISchema } from '@vercel/commerce/api'
import productsEndpoint from '@vercel/commerce/api/endpoints/catalog/products'
import getProducts from './products'

import type { BagistoAPI } from '../../index'

export type ProductsAPI = GetAPISchema<BagistoAPI, any>

export type ProductsEndpoint = ProductsAPI['endpoint']

export const handlers: ProductsEndpoint['handlers'] = { getProducts }

const productsApi = createEndpoint<ProductsAPI>({
  handler: productsEndpoint,
  handlers,
})

export default productsApi
