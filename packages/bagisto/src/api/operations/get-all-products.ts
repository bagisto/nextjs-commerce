import { Product } from '@vercel/commerce/types/product'
import { GetAllProductsOperation } from '@vercel/commerce/types/product'
import { normalizeProduct } from '../lib/normalize'
import { getAllProductsQuery } from '../queries/get-all-products-query'

import type { OperationContext } from '@vercel/commerce/api/operations'
import type { BagistoConfig } from '../index'

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

    const result = await bagistoConfig.fetch(query)

    const normalizedProducts = result?.data?.products?.data
      ? result?.data?.products?.data.map((item: any) =>
          normalizeProduct(item, bagistoConfig)
        )
      : []

    return {
      products: normalizedProducts,
    }
  }
  return getAllProducts
}
