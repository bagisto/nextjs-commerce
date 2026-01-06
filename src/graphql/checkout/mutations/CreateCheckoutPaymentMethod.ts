import { gql } from "@apollo/client";

export const CREATE_CHECKOUT_PAYMENT_METHODS = gql`
  mutation CreateCheckoutPaymentMethod(
    $token: String!
    $paymentMethod: String!
    $successUrl: String
    $failureUrl: String
    $cancelUrl: String
  ) {
    createCheckoutPaymentMethod(
      input: {
        token: $token
        paymentMethod: $paymentMethod
        paymentSuccessUrl: $successUrl
        paymentFailureUrl: $failureUrl
        paymentCancelUrl: $cancelUrl
      }
    ) {
      checkoutPaymentMethod {
        success
        message
        paymentGatewayUrl
        paymentData
      }
    }
  }
`;
