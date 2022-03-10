import type { CheckoutEndpoint } from './'

const submitCheckout: CheckoutEndpoint['handlers']['submitCheckout'] = async ({
  req,
  res,
  body,
  config,
}) => {
  console.log('submitCheckout')

  res.status(200).json({ data: null, errors: [] })
}

export default submitCheckout
