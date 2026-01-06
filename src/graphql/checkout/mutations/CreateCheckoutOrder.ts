import { gql } from "@apollo/client";

export const CREATE_CHECKOUT_ORDER = gql`
  mutation CreateCheckoutOrder($token: String!) {
    createCheckoutOrder(
      input: {
        token: $token
      }
    ) {
      checkoutOrder {
        id
        orderId
      }
    }
  }
`;
