export const savePlaceOrder = /* GraphQL */ `
  mutation placeOrder {
    placeOrder {
      success
      redirectUrl
      selectedMethod
      order {
        id
        customerEmail
        customerFirstName
        customerLastName
      }
    }
  }
`;
