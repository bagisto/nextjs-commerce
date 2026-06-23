import { gql } from "@apollo/client";
import { PRODUCT_CORE_FRAGMENT } from "../fragments";

export const GET_PRODUCTS = gql`
  ${PRODUCT_CORE_FRAGMENT}

  query GetProducts(
    $query: String
    $sortKey: String
    $reverse: Boolean
    $first: Int
    $last: Int
    $after: String
    $before: String
    $channel: String
    $locale: String
    $filter: String
  ) {
    products(
      query: $query
      sortKey: $sortKey
      reverse: $reverse
      first: $first
      last: $last
      after: $after
      before: $before
      channel: $channel
      locale: $locale
      filter: $filter
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
          ...ProductCore
        }
      }
    }
  }
`;
