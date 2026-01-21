import { gql } from "@apollo/client";

export const CREATE_CHECKOUT_SHIPPING_METHODS = gql`
  mutation CreateCheckoutShippingMethod(
    $shippingMethod: String!
  ) {
    createCheckoutShippingMethod(
      input: {
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
