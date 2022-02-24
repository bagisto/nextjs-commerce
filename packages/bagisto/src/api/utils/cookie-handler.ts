import { NextApiRequest } from 'next'

import { BagistoAPI } from '../'

export default class CookieHandler {
  config: BagistoAPI
  request: NextApiRequest
  response: any
  accessToken: any

  constructor(config: any, req: NextApiRequest, res: any) {
    this.config = config
    this.request = req
    this.response = res

    const token = this.parseCookie(req.cookies[config.customerCookie])
    this.accessToken = token ?? null
  }

  parseCookie(cookieValue?: any) {
    return cookieValue
      ? Buffer.from(cookieValue, 'base64').toString('ascii')
      : null
  }

  getAccessToken() {
    return this.accessToken
  }
}
