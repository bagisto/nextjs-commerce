import { gql } from "@apollo/client";

export const UPDATE_CART_ITEM = gql
`
  mutation UpdateCartItem(
    $token: String!
    $cartItemId: Int!
    $quantity: Int!
  ) {
    createUpdateCartItem(
      input: {
        token: $token
        cartItemId: $cartItemId
        quantity: $quantity
      }
    ) {
      updateCartItem {
        id
         taxAmount
        shippingAmount
        subtotal
        grandTotal
        items {
          edges {
            node {
              id
              cartId
              productId
              name
               price
               baseImage
              sku
              quantity
              type
              productUrlKey
              canChangeQty
            }
          }
        }
          itemsQty
        grandTotal
      }
    }
  }
`;
