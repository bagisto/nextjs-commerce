import type { CustomerAddressEndpoint } from '.'

const getAddresses: CustomerAddressEndpoint['handlers']['getAddresses'] =
  async ({ res }) => {
    return res.status(200).json({ data: null, errors: [] })
  }

export default getAddresses
