import type { OperationContext } from '@vercel/commerce/api/operations'

import { getAllOrdersQuery } from '../queries/order-queries/get-all-orders-query'
import type { BagistoCommerceConfig } from '../index'

export default function getOrderOperation({ commerce }: OperationContext<any>) {
  async function getOrder({
    query,
    variables,
    config,
  }: {
    query?: string
    variables?: any
    config?: Partial<BagistoCommerceConfig>
    preview?: boolean
  } = {}): Promise<any> {
    const bagistoConfig = commerce.getConfig(config)

    const result = await bagistoConfig.fetch(getAllOrdersQuery, {
      variables,
    })

    return {
      order: result?.data?.ordersList?.data[0] ?? null,
    }
  }

  return getOrder
}
