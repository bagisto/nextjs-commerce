import { NextApiRequest } from 'next'
import CookieHandler from './cookie-handler'
import { addToCartMutation } from '../mutations/add-to-cart-mutation'
import { removeCartItemMutation } from '../mutations/remove-cart-item-mutation'
import { updateCartItemMutation } from '../mutations/update-cart-item-mutation'
import { getCartQuery } from '../queries/get-cart-query'

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
    let accessToken = this.getCookieHandler().getAccessToken()

    let authorizationHeader = accessToken ? { Authorization: accessToken } : {}

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
    return !(this.getCookieHandler().getAccessToken() ? true : false)
  }

  async getCart() {
    if (!this.isGuest()) {
      let result = await this.config.fetch(
        getCartQuery,
        {},
        this.getFetchOptions()
      )

      return result?.data?.cartDetail
    }

    return null
  }

  async addItem(item: any) {
    if (!this.isGuest()) {
      const addToCartResponse = await this.config.fetch(
        addToCartMutation,
        { variables: { productId: item.productId, quantity: item.quantity } },
        this.getFetchOptions()
      )

      if (addToCartResponse?.data?.addItemToCart?.cart) {
        return await this.getCart()
      }
    }

    return null
  }

  async updateItem(itemId: any, item: any) {
    if (!this.isGuest()) {
      const updateItemResponse = await this.config.fetch(
        updateCartItemMutation,
        {
          variables: { itemId: itemId, quantity: item.quantity },
        },
        this.getFetchOptions()
      )

      if (updateItemResponse?.data?.updateItemToCart?.cart) {
        return await this.getCart()
      }
    }

    return null
  }

  async removeItem(itemId: any) {
    if (!this.isGuest()) {
      const removeItemResponse = await this.config.fetch(
        removeCartItemMutation,
        {
          variables: { itemId: itemId },
        },
        this.getFetchOptions()
      )

      if (removeItemResponse?.data?.removeCartItem?.cart) {
        return await this.getCart()
      }
    }

    return null
  }
}
