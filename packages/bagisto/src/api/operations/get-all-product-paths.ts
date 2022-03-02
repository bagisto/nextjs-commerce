import { BagistoCommerceConfig } from '../index'
import { normalizeProduct } from '../lib/normalize'
import { getAllProductsQuery } from '../queries/get-all-products-query'

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

    const result = await bagistoConfig.fetch(getAllProductsQuery)

    const normalizedProducts = result?.data?.products?.data
      ? result?.data?.products?.data.map((item: any) =>
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
