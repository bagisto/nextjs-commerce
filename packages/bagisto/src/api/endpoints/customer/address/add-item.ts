import CartHandler from '../../../utils/handler/cart-handler'

import type { CustomerAddressEndpoint } from '.'

const addItem: CustomerAddressEndpoint['handlers']['addItem'] = async ({
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

  const cartHandler = new CartHandler(config, req, res)

  await cartHandler.saveAddress(item)

  return res.status(200).json({ data: null, errors: [] })
}

export default addItem
