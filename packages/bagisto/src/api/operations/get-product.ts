import { Product } from '@vercel/commerce/types/product'
import { GetProductOperation } from '@vercel/commerce/types/product'
import type { OperationContext } from '@vercel/commerce/api/operations'
import type { BagistoCommerceConfig } from '../index'
import { getAllProductsQuery } from '../utils/graphql-api/queries/get-all-products-query'
import { normalizeProduct } from '../lib/normalize'

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

    const data = await bagistoConfig.fetch(query)

    const normalizedProducts = data.data.newProducts
      ? data.data.newProducts.map((item: any) =>
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
