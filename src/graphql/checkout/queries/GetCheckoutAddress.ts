import { gql } from "@apollo/client";

export const GET_CHECKOUT_ADDRESSES = gql`
  query CollectionGetCheckoutAddresses($token: String!) {
    collectionGetCheckoutAddresses( token: $token) {
      edges {
        node {
          id
          addressType
          firstName
          lastName
          companyName
          address
          city
          state
          country
          postcode
          email
          phone
          defaultAddress
          useForShipping
        }
      }
    }
  }
`;
