import { cartInfoFragment } from '../../fragments/cart'

export const updateCartItemMutation = /* GraphQL */ `
  mutation updateItemToCart($itemId: ID!, $quantity: Int!) {
    updateItemToCart(
      input: { qty: [{ cartItemId: $itemId, quantity: $quantity }] }
    ) {
      cart {
        ...cartInfo
      }
    }
  }

  ${cartInfoFragment}
`
