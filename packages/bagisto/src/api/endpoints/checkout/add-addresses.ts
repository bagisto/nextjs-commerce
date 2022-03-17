import CartHandler from '../../utils/handler/cart-handler'

import type { CheckoutEndpoint } from './'

const addAddresses: CheckoutEndpoint['handlers']['addAddresses'] = async ({
  req,
  res,
  body: { addresses },
  config,
}) => {
  const cartHandler = new CartHandler(config, req, res)

  const response = await cartHandler.saveAddresses(addresses)

  res.status(200).json({
    data: {
      shippingMethods:
        response?.data?.saveCheckoutAddresses?.shippingMethods ?? [],
    },
    errors: [],
  })
}

export default addAddresses
