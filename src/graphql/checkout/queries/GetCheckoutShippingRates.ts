import { gql } from "@apollo/client";

export const GET_CHECKOUT_SHIPPING_RATES = gql`
  query CheckoutShippingRates($token: String!) {
    collectionShippingRates(token: $token) {
      _id
      id
      code
      description
      method
      price
      label
    }
  }
`;
