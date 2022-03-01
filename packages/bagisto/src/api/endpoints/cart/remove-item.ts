import { getCartQuery } from '../../../api/queries/get-cart-query'
import CookieHandler from '../../../api/utils/cookie-handler'
import { normalizeCart } from '../../lib/normalize'
import { removeCartItemMutation } from '../../mutations/remove-cart-item-mutation'

import type { CartEndpoint } from './'

const removeItem: CartEndpoint['handlers']['removeItem'] = async ({
  req,
  res,
  body: { cartId, itemId },
  config,
}) => {
  if (!itemId) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }

  const cookieHandler = new CookieHandler(config, req, res)

  const accessToken = cookieHandler.getAccessToken()

  const removeItemResponse = await config.fetch(
    removeCartItemMutation,
    {
      variables: { itemId: itemId },
    },
    {
      headers: {
        Authorization: accessToken,
      },
    }
  )

  let currentCart = null

  if (removeItemResponse?.data?.removeCartItem?.cart) {
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

  res
    .status(200)
    .json({ data: currentCart ? normalizeCart(currentCart) : null })
}

export default removeItem
