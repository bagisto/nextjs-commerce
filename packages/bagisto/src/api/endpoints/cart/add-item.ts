import { getCartQuery } from '../../../api/queries/get-cart-query'
import CookieHandler from '../../../api/utils/cookie-handler'
import { normalizeCart } from '../../lib/normalize'
import { addToCartMutation } from '../../mutations/add-to-cart-mutation'
import type { CartEndpoint } from './'

const addItem: CartEndpoint['handlers']['addItem'] = async ({
  req,
  res,
  body: { cartId, item },
  config,
}) => {
  if (!item) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Missing item' }],
    })
  }

  if (!item.quantity) item.quantity = 1

  const cookieHandler = new CookieHandler(config, req, res)

  let currentCart = null
  let accessToken = cookieHandler.getAccessToken()

  if (accessToken) {
    const addToCartResponse = await config.fetch(
      addToCartMutation,
      { variables: { productId: item.productId, quantity: item.quantity } },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    )

    if (addToCartResponse?.data?.addItemToCart?.cart) {
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
  }

  res.status(200).json({ data: normalizeCart(currentCart) })
}

export default addItem
