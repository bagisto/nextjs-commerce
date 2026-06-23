import { gql } from "@apollo/client";


export const CREATE_ADD_PRODUCT_IN_CART = gql`
  mutation createAddProductInCart(
    $cartId: Int
    $productId: Int!
    $quantity: Int!
    $bundleOptions: String
    $bundleOptionQty: String
    $links: Iterable
    $booking: String
    $bookingNote: String
  ) {
    createAddProductInCart(
      input: {
        cartId: $cartId
        productId: $productId
        quantity: $quantity
        bundleOptions: $bundleOptions
        bundleOptionQty: $bundleOptionQty
        links: $links
        booking: $booking
        bookingNote: $bookingNote
      }
    ) {
      addProductInCart {
        id
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

export const CREATE_ADD_GROUPED_PRODUCT_IN_CART = gql`
  mutation createAddProductInCart(
    $cartId: Int
    $productId: Int!
    $quantity: Int!
    $groupedQty: String
  ) {
    createAddProductInCart(
      input: {
        cartId: $cartId
        productId: $productId
        quantity: $quantity
        groupedQty: $groupedQty
      }
    ) {
      addProductInCart {
        id
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
