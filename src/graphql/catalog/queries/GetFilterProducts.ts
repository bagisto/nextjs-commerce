import { gql } from "@apollo/client";
import { PRODUCT_CORE_FRAGMENT } from "../fragments";

export const GET_FILTER_PRODUCTS = gql`
  ${PRODUCT_CORE_FRAGMENT}
  query getProducts(
    $filter: String
    $sortKey: String
    $reverse: Boolean
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    products(
      filter: $filter
      sortKey: $sortKey
      reverse: $reverse
      first: $first
      last: $last
      after: $after
      before: $before
    ) {
      totalCount

      pageInfo {
        endCursor
        startCursor
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
