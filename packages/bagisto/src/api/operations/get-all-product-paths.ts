import { BagistoCommerceConfig } from '../index'
import { getAllProductsQuery } from '../utils/graphql-api/queries/get-all-products-query'
import { normalizeProduct } from '../lib/normalize'

export type GetAllProductPathsResult = {
  products: Array<{ path: string }>
}

export default function getAllProductPathsOperation({ commerce }: any) {
  async function getAllProductPaths({
    config,
  }: {
    config?: BagistoCommerceConfig
  } = {}): Promise<GetAllProductPathsResult> {
    const bagistoConfig = commerce.getConfig(config)

    const data = await bagistoConfig.fetch(getAllProductsQuery)

    const normalizedProducts = data.data.newProducts
      ? data.data.newProducts.map((item: any) =>
          normalizeProduct(item, bagistoConfig)
        )
      : []

    const products = normalizedProducts.map((product: any) => ({
      path: product.path,
    }))

    return Promise.resolve({
      products: products,
    })
  }

  return getAllProductPaths
}
