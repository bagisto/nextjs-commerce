import { normalizeCart } from '../../lib/normalize'
import CartHandler from '../../utils/cart-handler'
import type { CartEndpoint } from './'

const addItem: CartEndpoint['handlers']['addItem'] = async ({
  req,
  res,
  body: { item },
  config,
}) => {
  if (!item) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Missing item' }],
    })
  }

  if (!item.quantity) item.quantity = 1

  const cartHandler = new CartHandler(config, req, res)

  let currentCart = await cartHandler.addItem(item)

  res
    .status(200)
    .json({ data: currentCart ? normalizeCart(currentCart) : null })
}

export default addItem
