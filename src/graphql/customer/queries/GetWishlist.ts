import { gql } from "@apollo/client";

export const GET_WISHLIST = gql`
  query GetWishlist($id: ID!) {
    wishlist(id: $id) {
      id
      _id
      product {
        id
        name
        price
        baseImageUrl
      }
      customer {
        id
        email
      }
      channel {
        id
        code
      }
      createdAt
      updatedAt
    }
  }
`;
