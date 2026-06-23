import { gql } from "@apollo/client";

export const TOGGLE_WISHLIST_MUTATION = gql`
  mutation ToggleWishlist($input: toggleWishlistInput!) {
    toggleWishlist(input: $input) {
      wishlist {
        id
        _id
        product {
          _id
          id
          name
          price
        }
        createdAt
      }
    }
  }
`;
