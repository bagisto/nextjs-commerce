import { gql } from "@apollo/client";

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem(
    $cartItemId: Int!
  ) {
    createRemoveCartItem(
      input: {
        cartItemId: $cartItemId
      }
    ) {
      removeCartItem {
      id
      cartToken
       taxAmount
        shippingAmount
        subtotal
        grandTotal
      items {
        totalCount
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
    }
    }
  }
`;
