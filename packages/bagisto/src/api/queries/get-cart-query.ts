import { cartInfoFragment } from '../fragments/cart'

export const getCartQuery = /* GraphQL */ `
  query cartDetail {
    cartDetail {
      ...cartInfo
    }
  }

  ${cartInfoFragment}
`
