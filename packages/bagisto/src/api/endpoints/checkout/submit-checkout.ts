import CartHandler from '../../utils/handler/cart-handler'

import type { CheckoutEndpoint } from './'

const submitCheckout: CheckoutEndpoint['handlers']['submitCheckout'] = async ({
  req,
  res,
  body,
  config,
}) => {
  const cartHandler = new CartHandler(config, req, res)

  await cartHandler.placeOrder()

  res.status(200).json({ data: null, errors: [] })
}

export default submitCheckout
