import { Product } from '@vercel/commerce/types/product'
import { GetProductOperation } from '@vercel/commerce/types/product'
import ProductHandler from '../utils/handler/product-handler'

import type { OperationContext } from '@vercel/commerce/api/operations'
import type { BagistoCommerceConfig } from '../index'

export default function getProductOperation({
  commerce,
}: OperationContext<any>) {
  async function getProduct<T extends GetProductOperation>({
    query,
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<BagistoCommerceConfig>
    preview?: boolean
  } = {}): Promise<Product | {} | any> {
    const bagistoConfig = commerce.getConfig(config)

    const productHandler = new ProductHandler(bagistoConfig)

    const product = await productHandler.getProductBySlug(variables!.slug!)

    return {
      product,
    }
  }

  return getProduct
}
