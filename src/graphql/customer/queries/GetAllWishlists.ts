export const GET_ALL_WISHLISTS = `
  query GetAllWishlists($first: Int, $after: String) {
    wishlists(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          _id
          product {
            id
            name
            price
            sku
            type
            description
            baseImageUrl
            urlKey
            minimumPrice
          }
          customer {
            id
            email
          }
          channel {
            id
            code
            translation {
              name
            }
          }
          createdAt
          updatedAt
        }
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;
