import { createEndpoint, GetAPISchema } from '@vercel/commerce/api'
import signupEndpoint from '@vercel/commerce/api/endpoints/signup'
import signup from './signup'

import type { SignupSchema } from '../../../type/signup'
import type { BagistoAPI } from '../../'

export type SignupAPI = GetAPISchema<BagistoAPI, SignupSchema>

export type SignupEndpoint = SignupAPI['endpoint']

export const handlers: SignupEndpoint['handlers'] = { signup }

const singupApi = createEndpoint<SignupAPI>({
  handler: signupEndpoint,
  handlers,
})

export default singupApi
