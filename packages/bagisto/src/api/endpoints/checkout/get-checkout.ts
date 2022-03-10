import type { CheckoutEndpoint } from './'

const getCheckout: CheckoutEndpoint['handlers']['getCheckout'] = async ({
  req,
  res,
  body,
  config,
}) => {
  console.log('getCheckout')

  res.status(200).json({
    data: {
      hasPayment: true,
      hasShipping: true,
    },
    errors: [],
  })
}

export default getCheckout
