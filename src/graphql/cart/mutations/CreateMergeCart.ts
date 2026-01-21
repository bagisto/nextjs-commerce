import { gql } from "@apollo/client";

export const CREATE_MERGE_CART = gql`
  mutation createMergeCart(
    $cartId: Int!
  ) {
    createMergeCart(
      input: {
        cartId: $cartId
      }
    ) {
      mergeCart {
        id
         taxAmount
         subtotal
        shippingAmount
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
      }
    }
  }
`;
