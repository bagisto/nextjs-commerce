import { cartInfoFragment } from '../../fragments/cart'

export const addSimpleProductMutation = /* GraphQL */ `
  mutation addItemToCart($productId: ID!, $quantity: Int!) {
    addItemToCart(input: { productId: $productId, quantity: $quantity }) {
      cart {
        ...cartInfo
      }
    }
  }

  ${cartInfoFragment}
`

export const addConfigurableProductMutation = /* GraphQL */ `
  mutation addItemToCart($input: AddItemToCartInput!) {
    addItemToCart(input: $input) {
      cart {
        ...cartInfo
      }
    }
  }

  ${cartInfoFragment}
`
