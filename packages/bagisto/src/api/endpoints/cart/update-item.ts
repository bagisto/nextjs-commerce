import { normalizeCart } from '../../lib/normalize'
import CartHandler from '../../utils/handler/cart-handler'

import type { CartEndpoint } from './'

const updateItem: CartEndpoint['handlers']['updateItem'] = async ({
  req,
  res,
  body: { itemId, item },
  config,
}) => {
  if (!itemId || !item) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }

  const cartHandler = new CartHandler(config, req, res)

  let currentCart = await cartHandler.updateItem(itemId, item)

  res
    .status(200)
    .json({ data: currentCart ? normalizeCart(currentCart) : null })
}

export default updateItem
