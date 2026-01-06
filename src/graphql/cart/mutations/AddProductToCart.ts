import { gql } from "@apollo/client";

export const CREATE_ADD_PRODUCT_IN_CART = gql`
  mutation CreateAddProductInCart(
    $token: String
    $cartId: Int
    $productId: Int!
    $quantity: Int!
  ) {
    createAddProductInCart(
      input: {
        token: $token
        cartId: $cartId
        productId: $productId
        quantity: $quantity
      }
    ) {
      addProductInCart {
        id
        _id
        cartToken
        subtotal
        itemsCount
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
        success
        message
        sessionToken
        isGuest
        itemsQty
        itemsCount
      }
    }
  }
`;
