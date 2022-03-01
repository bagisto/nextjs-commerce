import { getCartQuery } from '../../../api/queries/get-cart-query'
import CookieHandler from '../../../api/utils/cookie-handler'
import { normalizeCart } from '../../lib/normalize'
import { updateCartItemMutation } from '../../mutations/update-cart-item-mutation'

import type { CartEndpoint } from './'

const updateItem: CartEndpoint['handlers']['updateItem'] = async ({
  req,
  res,
  body: { cartId, itemId, item },
  config,
}) => {
  if (!itemId || !item) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }

  const cookieHandler = new CookieHandler(config, req, res)

  const accessToken = cookieHandler.getAccessToken()

  const updateItemResponse = await config.fetch(
    updateCartItemMutation,
    {
      variables: { itemId: itemId, quantity: item.quantity },
    },
    {
      headers: {
        Authorization: accessToken,
      },
    }
  )

  let currentCart = null

  if (updateItemResponse?.data?.updateItemToCart?.cart) {
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

export default updateItem
