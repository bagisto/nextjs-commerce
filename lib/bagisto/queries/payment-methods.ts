export const getPaymentMethodsQuery = /* GraphQL */ `
  query PaymentMethods($input: PaymentMethodsInput!) {
    paymentMethods(input: $input) {
      paymentMethods {
        method
        methodTitle
        description
        sort
        image
      }
      message
    }
  }
`;
