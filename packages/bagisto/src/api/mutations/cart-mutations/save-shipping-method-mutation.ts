export const saveShippingMethodMutation = /* GraphQL */ `
  mutation paymentMethods($shippingMethod: String!) {
    paymentMethods(input: { shippingMethod: $shippingMethod }) {
      paymentMethods {
        method
        method_title
        description
        sort
      }
    }
  }
`
