import { createEndpoint, GetAPISchema } from '@vercel/commerce/api'
import loginEndpoint from '@vercel/commerce/api/endpoints/login'
import login from './login'

import type { LoginSchema } from '../../../type/login'
import type { BagistoAPI } from '../../'

export type LoginAPI = GetAPISchema<BagistoAPI, LoginSchema>

export type LoginEndpoint = LoginAPI['endpoint']

export const handlers: LoginEndpoint['handlers'] = { login }

const loginApi = createEndpoint<LoginAPI>({
  handler: loginEndpoint,
  handlers,
})

export default loginApi
