import { cartInfoFragment } from '../../fragments/cart'

export const removeCartItemMutation = /* GraphQL */ `
  mutation removeCartItem($itemId: ID!) {
    removeCartItem(id: $itemId) {
      cart {
        ...cartInfo
      }
    }
  }

  ${cartInfoFragment}
`
