import { gql } from "@apollo/client";

export const CREATE_CART_TOKEN = gql`
  mutation CreateCart {
    createCartToken(input: {}) {
      cartToken {
         id
      _id
      cartToken
      customerId
      channelId
      itemsCount
      subtotal
      baseSubtotal
      discountAmount
      baseDiscountAmount
      taxAmount
      baseTaxAmount
      shippingAmount
      baseShippingAmount
      grandTotal
      baseGrandTotal
      formattedSubtotal
      formattedDiscountAmount
      formattedTaxAmount
      formattedShippingAmount
      formattedGrandTotal
      couponCode
      success
      message
      sessionToken
      isGuest
      }
    }
  }
`;
