import { FetcherError } from '@vercel/commerce/utils/errors'
import type { LoginEndpoint } from './'

const invalidCredentials = /invalid credentials/i

const login: LoginEndpoint['handlers']['login'] = async ({
  req,
  res,
  body: { email, password },
  config,
  commerce,
}) => {

  console.log(email, password)
}

export default login
