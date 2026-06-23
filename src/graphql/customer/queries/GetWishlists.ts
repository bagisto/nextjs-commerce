import { gql } from "@apollo/client";

export const GET_WISHLISTS = gql`
  query GetWishlists {
    wishlists {
      edges {
        node {
          id
          _id
          product {
            id
            _id
            name
          }
        }
      }
    }
  }
`;
