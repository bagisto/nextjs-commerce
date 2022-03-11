import CartHandler from '../../utils/handler/cart-handler'

import type { CheckoutEndpoint } from './'

const getCheckout: CheckoutEndpoint['handlers']['getCheckout'] = async ({
  req,
  res,
  body,
  config,
}) => {
  const cartHandler = new CartHandler(config, req, res)

  const response = await cartHandler.getCart()

  res.status(200).json({
    data: {
      hasAddresses: response?.addresses.length === 2,
      hasShipping: Boolean(response?.selectedShippingRate?.id),
      hasPayment: Boolean(response?.payment?.id),
    },
    errors: [],
  })
}

export default getCheckout
