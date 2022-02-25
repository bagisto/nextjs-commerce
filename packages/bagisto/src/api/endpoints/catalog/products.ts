import { createEndpoint, GetAPISchema } from '@vercel/commerce/api'
import productsEndpoint from '@vercel/commerce/api/endpoints/catalog/products'
import { Product } from '@vercel/commerce/types/product'
import { normalizeProduct } from '../../lib/normalize'

import type { BagistoAPI } from '../../index'

export const getProducts: ProductsEndpoint['handlers']['getProducts'] = async ({
  res,
  body: { search, categoryId, brandId, sort },
  config,
}) => {
  const responseData: Product[] = []

  const found = responseData.length > 0 ? true : false

  const products: Product[] = responseData.map((item: any) =>
    normalizeProduct(item, config)
  )

  res.status(200).json({ data: { products, found } })
}

export type ProductsAPI = GetAPISchema<BagistoAPI, any>

export type ProductsEndpoint = ProductsAPI['endpoint']

export const handlers: ProductsEndpoint['handlers'] = { getProducts }

const productsApi = createEndpoint<ProductsAPI>({
  handler: productsEndpoint,
  handlers,
})

export default productsApi
