import { NextApiRequest } from 'next'
import CookieHandler from './cookie-handler'
import { addToCartMutation } from '../../mutations/add-to-cart-mutation'
import { removeCartItemMutation } from '../../mutations/remove-cart-item-mutation'
import { updateCartItemMutation } from '../../mutations/update-cart-item-mutation'
import { getCartQuery } from '../../queries/get-cart-query'

export default class CartHandler {
  config: any
  request: NextApiRequest
  response: any

  private cookieHandler!: CookieHandler
  private fetchOptions!: Object

  constructor(config: any, req: NextApiRequest, res: any) {
    this.config = config
    this.request = req
    this.response = res

    this.setCookieHandler()
    this.setFetchOptions()
  }

  private setCookieHandler() {
    this.cookieHandler = new CookieHandler(
      this.config,
      this.request,
      this.response
    )
  }

  private setFetchOptions() {
    const customerToken = this.getCookieHandler().getCustomerToken()

    const guestToken = this.getCookieHandler().getGuestToken()

    let authorizationHeader = customerToken
      ? { Authorization: customerToken }
      : { Cookie: guestToken }

    this.fetchOptions = {
      headers: { ...authorizationHeader },
    }
  }

  getCookieHandler(): CookieHandler {
    return this.cookieHandler
  }

  getFetchOptions(): Object {
    return this.fetchOptions
  }

  isGuest(): Boolean {
    return !(this.getCookieHandler().getCustomerToken() ? true : false)
  }

  guestTokenHandler(cookieValue?: any): void {
    if (this.isGuest()) {
      this.cookieHandler.setGuestToken(cookieValue)
      return
    }

    this.cookieHandler.setGuestToken('', {
      maxAge: -1,
      path: '/',
    })
  }

  async getCart() {
    const result = await this.config.fetch(
      getCartQuery,
      {},
      this.getFetchOptions()
    )

    this.guestTokenHandler(result?.res?.headers?.get('Set-Cookie'))

    return result?.data?.cartDetail
  }

  async addItem(item: any) {
    const result = await this.config.fetch(
      addToCartMutation,
      { variables: { productId: item.productId, quantity: item.quantity } },
      this.getFetchOptions()
    )

    if (result?.data?.addItemToCart?.cart) {
      return await this.getCart()
    }

    return null
  }

  async updateItem(itemId: any, item: any) {
    const result = await this.config.fetch(
      updateCartItemMutation,
      {
        variables: { itemId: itemId, quantity: item.quantity },
      },
      this.getFetchOptions()
    )

    if (result?.data?.updateItemToCart?.cart) {
      return await this.getCart()
    }

    return null
  }

  async removeItem(itemId: any) {
    const result = await this.config.fetch(
      removeCartItemMutation,
      {
        variables: { itemId: itemId },
      },
      this.getFetchOptions()
    )

    if (result?.data?.removeCartItem?.cart) {
      return await this.getCart()
    }

    return null
  }
}
