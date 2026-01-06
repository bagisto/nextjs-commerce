import { gql } from "@apollo/client";

export const GET_CART_ITEM = gql`
  mutation GetCartItem($token: String!) {
    createReadCart(input: { token: $token }) {
      readCart {
        id
        itemsCount
        taxAmount
        grandTotal
        shippingAmount
        selectedShippingRate
        selectedShippingRateTitle
        subtotal
        itemsQty
        isGuest
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
        paymentMethod
        paymentMethodTitle
      }
    }
  }
`;
