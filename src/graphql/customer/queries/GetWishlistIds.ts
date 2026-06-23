export const GET_WISHLIST_IDS = `
  query GetWishlistIds($first: Int, $after: String) {
    wishlists(first: $first, after: $after) {
      edges {
        node {
          id
          product {
            id
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
