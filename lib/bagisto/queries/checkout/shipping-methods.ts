export const getShippingMethodsQuery = /* GraphQL */ `
  query ShippingMethods {
    shippingMethods {
      message
      shippingMethods {
        title
        methods {
          code
          label
          price
          formattedPrice
          basePrice
          formattedBasePrice
        }
      }
    }
  }
`;
