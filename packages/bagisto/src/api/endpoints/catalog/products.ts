import { createEndpoint, GetAPISchema } from '@vercel/commerce/api'
import productsEndpoint from '@vercel/commerce/api/endpoints/catalog/products'
import { Product } from '@vercel/commerce/types/product'
import { normalizeProduct } from '../../lib/normalize'
import { getAllProductsQuery } from '../../queries/get-all-products-query'
import {
  getFeaturedProductsQuery,
  getNewProductsQuery,
} from '../../queries/get-category-products-query'

import type { BagistoAPI } from '../../index'

const allProducts = async (config: any) => {
  const result = await config.fetch(getAllProductsQuery)

  return result?.data?.getProductListing?.data ?? []
}

const newProducts = async (config: any) => {
  const result = await config.fetch(getNewProductsQuery)

  return result?.data?.newProducts ?? []
}

const featuredProducts = async (config: any) => {
  const result = await config.fetch(getFeaturedProductsQuery)

  return result?.data?.featuredProducts ?? []
}

export const getProducts: ProductsEndpoint['handlers']['getProducts'] = async ({
  res,
  body: { search, categoryId, brandId, sort },
  config,
}) => {
  let responseData = []

  switch (categoryId) {
    case 'featured-products':
      responseData = await featuredProducts(config)
      break

    case 'new-products':
      responseData = await newProducts(config)
      break

    default:
      responseData = await allProducts(config)
      break
  }

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
