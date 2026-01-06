import { gql } from "@apollo/client";

export const GET_CHECKOUT_PAYMENT_METHODS = gql`
  query CheckoutPaymentMethods($token: String!) {
    collectionPaymentMethods(token: $token) {
      _id
      id
      method
      title
      description
      icon
      isAllowed
    }
  }
`;
