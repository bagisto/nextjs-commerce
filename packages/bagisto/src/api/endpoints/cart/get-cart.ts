import { normalizeCart } from '../../lib/normalize'
import CartHandler from '../../utils/cart-handler'

import type { CartEndpoint } from '.'

const getCart: CartEndpoint['handlers']['getCart'] = async ({
  req,
  res,
  config,
}) => {
  const cartHandler = new CartHandler(config, req, res)

  let currentCart = await cartHandler.getCart()

  res.status(200).json({
    data: currentCart ? normalizeCart(currentCart) : null,
  })
}

export default getCart
