export const getShippingMethodQuery = /* GraphQL */ `
  query shippingMethods {
    shippingMethods {
      message
      shippingMethods {
        title
        methods {
          code
          label
          price
          formattedPrice
        }
      }
    }
  }
`;
