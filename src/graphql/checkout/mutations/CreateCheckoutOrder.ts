import { gql } from "@apollo/client";

export const CREATE_CHECKOUT_ORDER = gql`
  mutation CreateCheckoutOrder {
    createCheckoutOrder(
      input: {}
    ) {
      checkoutOrder {
        id
        orderId
      }
    }
  }
`;
