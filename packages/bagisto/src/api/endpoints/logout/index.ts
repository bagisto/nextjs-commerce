import { createEndpoint, GetAPISchema } from '@vercel/commerce/api'
import logoutEndpoint from '@vercel/commerce/api/endpoints/logout'
import logout from './logout'

import type { LogoutSchema } from '../../../type/logout'
import type { BagistoAPI } from '../../'

export type LogoutAPI = GetAPISchema<BagistoAPI, LogoutSchema>

export type LogoutEndpoint = LogoutAPI['endpoint']

export const handlers: LogoutEndpoint['handlers'] = { logout }

const logoutApi = createEndpoint<LogoutAPI>({
  handler: logoutEndpoint,
  handlers,
})

export default logoutApi
