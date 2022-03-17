import CartHandler from '../../utils/handler/cart-handler'

import type { CheckoutEndpoint } from './'

const addShippingMethod: CheckoutEndpoint['handlers']['addShippingMethod'] =
  async ({ req, res, body: { shippingMethod }, config }) => {
    const cartHandler = new CartHandler(config, req, res)

    const response = await cartHandler.saveShippingMethod(shippingMethod)

    res.status(200).json({
      data: {
        paymentMethods: response?.data?.paymentMethods?.paymentMethods ?? [],
      },
      errors: [],
    })
  }

export default addShippingMethod
