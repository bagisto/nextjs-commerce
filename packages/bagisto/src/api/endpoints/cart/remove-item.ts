import { normalizeCart } from '../../lib/normalize'
import CartHandler from '../../utils/cart-handler'

import type { CartEndpoint } from './'

const removeItem: CartEndpoint['handlers']['removeItem'] = async ({
  req,
  res,
  body: { itemId },
  config,
}) => {
  if (!itemId) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }

  const cartHandler = new CartHandler(config, req, res)

  let currentCart = await cartHandler.removeItem(itemId)

  res
    .status(200)
    .json({ data: currentCart ? normalizeCart(currentCart) : null })
}

export default removeItem
