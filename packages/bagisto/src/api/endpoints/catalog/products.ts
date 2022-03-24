import { createEndpoint, GetAPISchema } from '@vercel/commerce/api'
import productsEndpoint from '@vercel/commerce/api/endpoints/catalog/products'
import ProductHandler from '../../utils/handler/product-handler'

import type { BagistoAPI } from '../../index'

const generateVariables = (
  search: string,
  categoryId: string,
  brandId: string,
  sort: string
) => {
  let variables: any = {
    input: {},
  }

  if (search) {
    variables['input']['search'] = search
  }

  if (categoryId) {
    if (categoryId === 'new-products') {
      variables['input']['new'] = true
    } else if (categoryId === 'featured-products') {
      variables['input']['featured'] = true
    } else {
      variables['input']['categorySlug'] = categoryId
    }
  }

  if (sort) {
    const [columnName, direction] = sort.split('-')

    if (columnName === 'latest') {
      variables['input']['sort'] = 'id'
    } else {
      variables['input']['sort'] = columnName
    }

    variables['input']['order'] = direction
  }

  return variables
}

export const getProducts: ProductsEndpoint['handlers']['getProducts'] = async ({
  res,
  body: { search, categoryId, brandId, sort },
  config,
}) => {
  const productHandler = new ProductHandler(config)

  const products = await productHandler.getAllFilteredProducts(
    generateVariables(search, categoryId, brandId, sort)
  )

  const found = products.length > 0 ? true : false

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
