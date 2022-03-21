import CookieHandler from '../../utils/handler/cookie-handler'

import { normalizeOrders } from '../../lib/normalize'
import { getAllOrdersQuery } from '../../queries/order-queries/get-all-orders-query'

const getOrders = async ({ req, res, config }: any) => {
  const cookieHandler = new CookieHandler(config, req, res)

  const customerToken = cookieHandler.getCustomerToken()

  const authorizationHeader = customerToken
    ? { Authorization: customerToken }
    : {}

  const result = await config.fetch(
    getAllOrdersQuery,
    {},
    {
      headers: { ...authorizationHeader },
    }
  )

  res.status(200).json({
    data: result?.data?.ordersList?.data
      ? normalizeOrders(result?.data?.ordersList?.data)
      : [],
  })
}

export default getOrders
