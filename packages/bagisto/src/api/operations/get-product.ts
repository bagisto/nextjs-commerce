import { Product } from '@vercel/commerce/types/product'
import { GetProductOperation } from '@vercel/commerce/types/product'
import type { OperationContext } from '@vercel/commerce/api/operations'
import type { BagistoCommerceConfig } from '../index'
import { getProductQuery } from '../utils/graphql-api/queries/get-product-query'
import { normalizeProduct } from '../lib/normalize'

export default function getProductOperation({
  commerce,
}: OperationContext<any>) {
  async function getProduct<T extends GetProductOperation>({
    query = getProductQuery,
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<BagistoCommerceConfig>
    preview?: boolean
  } = {}): Promise<Product | {} | any> {
    const productVariables = { slug: variables?.slug }

    const bagistoConfig = commerce.getConfig(config)

    const data = await bagistoConfig.fetch(query)

    const normalizedProduct = normalizeProduct(
      data.data.products.data[0],
      bagistoConfig
    )

    return {
      product: normalizedProduct,
    }
  }

  return getProduct
}
