import { Product } from '@vercel/commerce/types/product'
import { GetProductOperation } from '@vercel/commerce/types/product'
import { normalizeProduct } from '../lib/normalize'
import { getAllProductsQuery } from '../queries/get-all-products-query'

import type { OperationContext } from '@vercel/commerce/api/operations'
import type { BagistoCommerceConfig } from '../index'

export default function getProductOperation({
  commerce,
}: OperationContext<any>) {
  async function getProduct<T extends GetProductOperation>({
    query = getAllProductsQuery,
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<BagistoCommerceConfig>
    preview?: boolean
  } = {}): Promise<Product | {} | any> {
    const bagistoConfig = commerce.getConfig(config)

    const result = await bagistoConfig.fetch(query)

    const normalizedProducts = result?.data?.getProductListing?.data
      ? result?.data?.getProductListing?.data.map((item: any) =>
          normalizeProduct(item, bagistoConfig)
        )
      : []

    return {
      product: normalizedProducts.find(
        ({ slug }: any) => slug === variables!.slug
      ),
    }
  }

  return getProduct
}
