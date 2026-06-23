export const GET_COMPARE_IDS = `
  query GetCompareIds($first: Int, $after: String) {
    compareItems(first: $first, after: $after) {
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
