import fetcher from './fetcher'
import { handler as useLogin } from './auth/use-login'
import { handler as useLogout } from './auth/use-logout'
import { handler as useSignup } from './auth/use-signup'
import { handler as useAddItem } from './cart/use-add-item'
import { handler as useCart } from './cart/use-cart'
import { handler as useRemoveItem } from './cart/use-remove-item'
import { handler as useUpdateItem } from './cart/use-update-item'
import { handler as useCheckout } from './checkout/use-checkout'
import { handler as useSubmitCheckout } from './checkout/use-submit-checkout'
import { handler as useCustomer } from './customer/use-customer'
import { handler as useSearch } from './product/use-search'

export const bagistoProvider = {
  locale: 'en-us',
  cartCookie: 'session',
  fetcher: fetcher,
  cart: { useCart, useAddItem, useUpdateItem, useRemoveItem },
  checkout: { useCheckout, useSubmitCheckout },
  customer: { useCustomer },
  products: { useSearch },
  auth: { useLogin, useLogout, useSignup },
}

export type BagistoProvider = typeof bagistoProvider
