import CartHandler from '../../utils/handler/cart-handler'

import type { CheckoutEndpoint } from './'

const addPaymentMethod: CheckoutEndpoint['handlers']['addPaymentMethod'] =
  async ({ req, res, body: { paymentMethod }, config }) => {
    const cartHandler = new CartHandler(config, req, res)

    await cartHandler.savePaymentMethod(paymentMethod)

    res.status(200).json({
      data: {},
      errors: [],
    })
  }

export default addPaymentMethod
