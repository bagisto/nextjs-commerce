import { createEndpoint, GetAPISchema } from '@vercel/commerce/api'
import productsEndpoint from '@vercel/commerce/api/endpoints/catalog/products'
import { Product } from '@vercel/commerce/types/product'
import ProductHandler from '../../utils/handler/product-handler'

import type { BagistoAPI } from '../../index'

export const getProducts: ProductsEndpoint['handlers']['getProducts'] = async ({
  res,
  body: { search, categoryId, brandId, sort },
  config,
}) => {
  const productHandler = new ProductHandler(config)

  const products = await productHandler.getAllProductsByCategory(categoryId)

  const normalizedProducts: Product[] =
    productHandler.normalizeAllProducts(products)

  const found = products.length > 0 ? true : false

  res.status(200).json({ data: { products: normalizedProducts, found } })
}

export type ProductsAPI = GetAPISchema<BagistoAPI, any>

export type ProductsEndpoint = ProductsAPI['endpoint']

export const handlers: ProductsEndpoint['handlers'] = { getProducts }

const productsApi = createEndpoint<ProductsAPI>({
  handler: productsEndpoint,
  handlers,
})

export default productsApi
