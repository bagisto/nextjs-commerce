import CookieHandler from '../../../api/utils/cookie-handler'
import { normalizeCart } from '../../lib/normalize'
import { getCartQuery } from '../../queries/get-cart-query'

import type { CartEndpoint } from '.'

const getCart: CartEndpoint['handlers']['getCart'] = async ({
  req,
  res,
  body: { cartId },
  config,
}) => {
  let currentCart

  try {
    const cookieHandler = new CookieHandler(config, req, res)

    let accessToken = cookieHandler.getAccessToken()

    if (accessToken) {
      let result = await config.fetch(
        getCartQuery,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )

      currentCart = result?.data?.cartDetail
    }
  } catch (error) {
    throw error
  }

  res.status(200).json({
    data: currentCart ? normalizeCart(currentCart) : null,
  })
}

export default getCart
