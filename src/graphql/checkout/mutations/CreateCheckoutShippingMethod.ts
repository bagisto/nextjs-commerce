import { gql } from "@apollo/client";

export const CREATE_CHECKOUT_SHIPPING_METHODS = gql`
  mutation CreateCheckoutShippingMethod(
    $token: String!
    $shippingMethod: String!
  ) {
    createCheckoutShippingMethod(
      input: {
        token: $token
        shippingMethod: $shippingMethod
      }
    ) {
      checkoutShippingMethod {
        success
        id
        message
      }
    }
  }
`;
