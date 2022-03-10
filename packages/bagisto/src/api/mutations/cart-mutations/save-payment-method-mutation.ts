import { cartInfoFragment } from '../../fragments/cart'

export const savePaymentMethodMutation = /* GraphQL */ `
  mutation savePayment($paymentMethod: String!) {
    savePayment(input: { payment: { method: $paymentMethod } }) {
      cart {
        ...cartInfo
      }
    }
  }

  ${cartInfoFragment}
`
