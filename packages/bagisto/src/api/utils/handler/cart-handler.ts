import { NextApiRequest } from 'next'
import CookieHandler from './cookie-handler'
import ProductHandler from './product-handler'
import { removeCartItemMutation } from '../../mutations/cart-mutations/remove-cart-item-mutation'
import { updateCartItemMutation } from '../../mutations/cart-mutations/update-cart-item-mutation'
import { getCartQuery } from '../../queries/get-cart-query'
import {
  addSimpleProductMutation,
  addConfigurableProductMutation,
} from '../../mutations/cart-mutations/add-to-cart-mutation'

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
    const productHandler = new ProductHandler(this.config)

    item['product'] = await productHandler.getProductById(item.productId)

    let result
    switch (item['product'].type) {
      case 'configurable':
        result = await this.addConfigurableProduct(item)
        break

      default:
        result = await this.addSimpleProduct(item)
        break
    }

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

  async addSimpleProduct(item: any) {
    return await this.config.fetch(
      addSimpleProductMutation,
      { variables: { productId: item.productId, quantity: item.quantity } },
      this.getFetchOptions()
    )
  }

  async addConfigurableProduct(item: any) {
    let selectedVariant = item.product.variants.find(
      (variant: any) => variant.id == item.variantId
    )

    return await this.config.fetch(
      addConfigurableProductMutation,
      {
        variables: {
          input: {
            productId: item.productId,
            quantity: item.quantity,
            selectedConfigurableOption: parseInt(item.variantId),
            superAttribute: selectedVariant.options.map((option: any) => {
              return {
                attributeId: parseInt(option.id),
                attributeOptionId: parseInt(option.values.pop().id),
              }
            }),
          },
        },
      },
      this.getFetchOptions()
    )
  }
}
