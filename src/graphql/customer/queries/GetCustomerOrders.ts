import { gql } from "@apollo/client";

export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($first: Int, $after: String) {
    customerOrders(first: $first, after: $after) {
      edges {
        cursor
        node {
          _id
          incrementId
          status
          channelName
          customerEmail
          customerFirstName
          customerLastName
          shippingMethod
          shippingTitle
          couponCode
          totalItemCount
          totalQtyOrdered
          grandTotal
          baseGrandTotal
          subTotal
          baseSubTotal
          taxAmount
          shippingAmount
          discountAmount
          baseCurrencyCode
          orderCurrencyCode
          createdAt
          updatedAt
        }
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;
