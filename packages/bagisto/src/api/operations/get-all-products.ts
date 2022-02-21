import { Product } from '@vercel/commerce/types/product'
import { GetAllProductsOperation } from '@vercel/commerce/types/product'
import type { OperationContext } from '@vercel/commerce/api/operations'
import type { BagistoConfig, BagistoProvider } from '../index'
import { getAllProductsQuery } from '../utils/graphql-api/queries/get-all-products-query'
import { normalizeProduct } from '../lib/normalize'

export default function getAllProductsOperation({
  commerce,
}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = getAllProductsQuery,
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<BagistoConfig>
    preview?: boolean
  } = {}): Promise<{ products: Product[] | any[] }> {
    const bagistoConfig = commerce.getConfig(config)

    const data = await bagistoConfig.fetch(query)

    const normalizedProducts = data.data.newProducts
      ? data.data.newProducts.map((item: any) =>
          normalizeProduct(item, bagistoConfig)
        )
      : []

    return {
      products: normalizedProducts,
    }
  }
  return getAllProducts
}
