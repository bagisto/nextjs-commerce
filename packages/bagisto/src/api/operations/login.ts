import { prepareSetCookie, setCookies } from '../lib/cookie'
import { loginMutation } from '../mutations/login-mutation'

import type { ServerResponse } from 'http'
import type {
  OperationContext,
  OperationOptions,
} from '@vercel/commerce/api/operations'
import type { LoginOperation } from '../../type/login'
import type { BagistoConfig } from '../'

export default function loginOperation({ commerce }: OperationContext<any>) {
  async function login<T extends LoginOperation>(opts: {
    variables: T['variables']
    config?: BagistoConfig
    res: ServerResponse
  }): Promise<T['data']>

  async function login<T extends LoginOperation>(
    opts: {
      variables: T['variables']
      config?: BagistoConfig
      res: ServerResponse
    } & OperationOptions
  ): Promise<T['data']>

  async function login<T extends LoginOperation>({
    query = loginMutation,
    variables,
    res: response,
    config,
  }: {
    query?: string
    variables: T['variables']
    res: ServerResponse
    config?: BagistoConfig
  }): Promise<T['data']> {
    const bagistoConfig = commerce.getConfig(config)

    const res = await bagistoConfig.fetch(query, { variables })

    const token = res?.data?.customerLogin?.accessToken

    const authCookie = prepareSetCookie(bagistoConfig.customerCookie, token)
    setCookies(response, [authCookie])

    return {
      result: res?.data?.customerLogin ?? null,
    }
  }

  return login
}
