import { gql } from "@apollo/client";

export const GET_CUSTOMER_ORDER = gql`
  query GetCustomerOrder($id: ID!) {
    customerOrder(id: $id) { 
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
      grandTotalInvoiced
      grandTotalRefunded
      subTotal
      baseSubTotal
      taxAmount
      baseTaxAmount
      discountAmount
      baseDiscountAmount
      shippingAmount
      baseShippingAmount
      baseCurrencyCode
      channelCurrencyCode
      orderCurrencyCode
      items {
        edges {
          node {
            id
            sku
            name
            additional
            qtyOrdered
            qtyShipped
            qtyInvoiced
            qtyCanceled
            qtyRefunded
            price
            total
            basePrice
            baseTotal
          }
        }
      }
      addresses {
        edges {
          node {
            id
            _id
            addressType
            parentAddressId
            customerId
            cartId
            orderId
            name
            firstName
            lastName
            companyName
            address
            city
            state
            country
            postcode
            useForShipping
            email
            phone
            gender
            vatId
            defaultAddress
            createdAt
            updatedAt
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;
