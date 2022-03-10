import CartHandler from '../../utils/handler/cart-handler'

import type { CheckoutEndpoint } from './'

const addShippingMethod: CheckoutEndpoint['handlers']['addShippingMethod'] =
  async ({ req, res, body: { shippingMethod }, config }) => {
    const cartHandler = new CartHandler(config, req, res)

    await cartHandler.saveShippingMethod(shippingMethod)

    res.status(200).json({
      data: {},
      errors: [],
    })
  }

export default addShippingMethod
