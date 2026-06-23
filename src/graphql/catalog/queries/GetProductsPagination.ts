import { gql } from "@apollo/client";

export const GET_PRODUCTS_PAGINATION = gql`
  query GetProductsPagination(
    $query: String
    $sortKey: String
    $reverse: Boolean
    $first: Int
    $last: Int
    $channel: String
    $locale: String
    $after: String
    $before: String
  ) {
    products(
      query: $query
      sortKey: $sortKey
      reverse: $reverse
      first: $first
      last: $last
      channel: $channel
      locale: $locale
      after: $after
      before: $before
    ) {
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
        }
      }
    }
  }
`;
