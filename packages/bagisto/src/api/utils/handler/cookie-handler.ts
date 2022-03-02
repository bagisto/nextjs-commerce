import { NextApiRequest } from 'next'
import { prepareSetCookie, setCookies } from '../../lib/cookie'

export default class CookieHandler {
  config: any
  request: NextApiRequest
  response: any

  constructor(config: any, req: NextApiRequest, res: any) {
    this.config = config
    this.request = req
    this.response = res
  }

  parseCookie(cookieValue?: any) {
    return cookieValue
      ? Buffer.from(cookieValue, 'base64').toString('ascii')
      : null
  }

  setGuestToken(cookieValue?: any, options: any = {}) {
    const guestCookie = prepareSetCookie(
      this.config.guestCookie,
      cookieValue,
      options
    )

    setCookies(this.response, [guestCookie])
  }

  getGuestToken() {
    const token = this.parseCookie(
      this.request.cookies[this.config.guestCookie]
    )

    return token ?? null
  }

  setCustomerToken(cookieValue?: any, options: any = {}) {
    const authCookie = prepareSetCookie(
      this.config.customerCookie,
      cookieValue,
      options
    )

    setCookies(this.response, [authCookie])
  }

  getCustomerToken() {
    const token = this.parseCookie(
      this.request.cookies[this.config.customerCookie]
    )

    return token ?? null
  }
}
