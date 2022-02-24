import { createEndpoint, GetAPISchema } from '@vercel/commerce/api';
import customerEndpoint from '@vercel/commerce/api/endpoints/customer';

import getLoggedInCustomer from './customer';

import type { CustomerSchema } from '../../../type/customer'
import type { BagistoAPI } from '../../'

export type CustomerAPI = GetAPISchema<BagistoAPI, CustomerSchema>

export type CustomerEndpoint = CustomerAPI['endpoint']

export const handlers: CustomerEndpoint['handlers'] = { getLoggedInCustomer }

const customerApi = createEndpoint<CustomerAPI>({
  handler: customerEndpoint,
  handlers,
})

export default customerApi
