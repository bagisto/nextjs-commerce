import { normalizeOrders } from '../../lib/normalize'
import { getAllOrdersQuery } from '../../queries/order-queries/get-all-orders-query'
import CookieHandler from '../../utils/handler/cookie-handler'

const getOrders = async ({
  req,
  body: { orderId, page },
  res,
  config,
}: any) => {
  const cookieHandler = new CookieHandler(config, req, res)

  const customerToken = cookieHandler.getCustomerToken()

  const authorizationHeader = customerToken
    ? { Authorization: customerToken }
    : {}

  let variables = {}

  if (orderId) {
    variables = {
      input: {
        id: orderId,
      },
    }
  }

  if (page) {
    variables = {
      page,
    }
  }

  const result = await config.fetch(
    getAllOrdersQuery,
    {
      variables,
    },
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
