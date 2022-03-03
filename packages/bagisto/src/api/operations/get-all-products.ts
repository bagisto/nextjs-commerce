import { Product } from '@vercel/commerce/types/product'
import { GetAllProductsOperation } from '@vercel/commerce/types/product'
import ProductHandler from '../utils/handler/product-handler'

import type { OperationContext } from '@vercel/commerce/api/operations'
import type { BagistoConfig } from '../index'

export default function getAllProductsOperation({
  commerce,
}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query,
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<BagistoConfig>
    preview?: boolean
  } = {}): Promise<{ products: Product[] | any[] }> {
    const bagistoConfig = commerce.getConfig(config)

    const productHandler = new ProductHandler(bagistoConfig)

    const products = await productHandler.getAllProducts()

    return {
      products,
    }
  }
  return getAllProducts
}
