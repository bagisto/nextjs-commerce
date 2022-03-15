import { NextApiRequest } from 'next'

import CookieHandler from './cookie-handler'
import ProductHandler from './product-handler'

import { getCartQuery } from '../../queries/get-cart-query'
import {
  addSimpleProductMutation,
  addConfigurableProductMutation,
} from '../../mutations/cart-mutations/add-to-cart-mutation'
import { updateCartItemMutation } from '../../mutations/cart-mutations/update-cart-item-mutation'
import { removeCartItemMutation } from '../../mutations/cart-mutations/remove-cart-item-mutation'
import { saveAddressesMutation } from '../../mutations/cart-mutations/save-address-mutation'
import { saveShippingMethodMutation } from '../../mutations/cart-mutations/save-shipping-method-mutation'
import { savePaymentMethodMutation } from '../../mutations/cart-mutations/save-payment-method-mutation'
import { placeOrderMutation } from '../../mutations/cart-mutations/place-order-mutation'

import type { AddressFields } from '@vercel/commerce/types/customer/address'

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

  async saveAddresses(addresses: AddressFields) {
    const billingAddress = {
      companyName: addresses.billing.company,
      firstName: addresses.billing.firstName,
      lastName: addresses.billing.lastName,
      email: addresses.billing.email,
      address1: addresses.billing.streetAddress,
      address2: '',
      city: addresses.billing.city,
      country: addresses.billing.country,
      state: addresses.billing.state,
      postcode: addresses.billing.zipCode,
      phone: addresses.billing.phone,
      useForShipping: addresses.billing.useForShipping,
      saveAsAddress: false,
    }

    const shippingAddress = billingAddress.useForShipping
      ? billingAddress
      : {
          companyName: addresses.shipping.company,
          firstName: addresses.shipping.firstName,
          lastName: addresses.shipping.lastName,
          email: addresses.shipping.email,
          address1: addresses.shipping.streetAddress,
          address2: '',
          city: addresses.shipping.city,
          country: addresses.shipping.country,
          state: addresses.shipping.state,
          postcode: addresses.shipping.zipCode,
          phone: addresses.shipping.phone,
          saveAsAddress: false,
        }

    return await this.config.fetch(
      saveAddressesMutation,
      {
        variables: {
          input: {
            billingAddressId: 0,
            shippingAddressId: 0,
            billing: billingAddress,
            shipping: shippingAddress,
            type: 'shipping',
          },
        },
      },
      this.getFetchOptions()
    )
  }

  async saveShippingMethod(shippingMethod: string) {
    return await this.config.fetch(
      saveShippingMethodMutation,
      {
        variables: {
          shippingMethod,
        },
      },
      this.getFetchOptions()
    )
  }

  async savePaymentMethod(paymentMethod: string) {
    return await this.config.fetch(
      savePaymentMethodMutation,
      {
        variables: {
          paymentMethod,
        },
      },
      this.getFetchOptions()
    )
  }

  async placeOrder() {
    return await this.config.fetch(
      placeOrderMutation,
      {},
      this.getFetchOptions()
    )
  }
}
