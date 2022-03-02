import { normalizeCustomer } from '../../lib/normalize'
import { getCustomerAccountQuery } from '../../queries/get-customer-account-query'
import CookieHandler from '../../utils/handler/cookie-handler'

import type { CustomerEndpoint } from './'

const getLoggedInCustomer: CustomerEndpoint['handlers']['getLoggedInCustomer'] =
  async ({ req, res, config }) => {
    const cookieHandler = new CookieHandler(config, req, res)

    let accessToken = cookieHandler.getCustomerToken()

    if (accessToken) {
      const { data } = await config.fetch(getCustomerAccountQuery, undefined, {
        headers: {
          Accept: 'application/json',
          Authorization: accessToken,
        },
      })

      const customer = normalizeCustomer(data?.accountInfo?.customer)

      if (!customer.id) {
        return res.status(400).json({
          data: null,
          errors: [{ message: 'Customer not found', code: 'not_found' }],
        })
      }

      return res.status(200).json({ data: { customer } })
    }

    return res.status(200).json({ data: null })
  }

export default getLoggedInCustomer
