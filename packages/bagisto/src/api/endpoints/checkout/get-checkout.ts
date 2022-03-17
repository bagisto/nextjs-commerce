import { normalizeCartAddresses } from '../../lib/normalize'
import CartHandler from '../../utils/handler/cart-handler'

import type { CheckoutEndpoint } from './'

const getCheckout: CheckoutEndpoint['handlers']['getCheckout'] = async ({
  req,
  res,
  body,
  config,
}) => {
  const cartHandler = new CartHandler(config, req, res)

  const cart = await cartHandler.getCart()

  let cartAddresses = null
  let cartShippingMethods = null
  if (cart?.addresses.length === 2) {
    cartAddresses = normalizeCartAddresses(cart.addresses)

    cartShippingMethods = await cartHandler.saveAddresses(cartAddresses)

    cartShippingMethods =
      cartShippingMethods?.data?.saveCheckoutAddresses?.shippingMethods ?? []
  }

  let cartPaymentMethods
  if (Boolean(cart?.selectedShippingRate?.id)) {
    cartPaymentMethods = await cartHandler.saveShippingMethod(
      cart?.selectedShippingRate?.method
    )

    cartPaymentMethods =
      cartPaymentMethods?.data?.paymentMethods?.paymentMethods ?? []
  }

  res.status(200).json({
    data: {
      addresses: cartAddresses,
      shippingMethods: cartShippingMethods,
      paymentMethods: cartPaymentMethods,
      selectedShippingMethod: cart?.selectedShippingRate ?? null,
      selectedPaymentMethod: cart?.payment ?? null,
    },
    errors: [],
  })
}

export default getCheckout
