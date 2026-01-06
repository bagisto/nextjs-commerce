import { gql } from "@apollo/client";
import { PRODUCT_SECTION_FRAGMENT } from "../fragments";

export const GET_FILTER_OPTIONS = gql`
  query FetchAttribute($id: ID!) {
    attribute(id: $id) {
      id
      code
      options {
        edges {
          node {
            id
            adminName
            translations {
              edges {
                node {
                  id
                  label
                  locale
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_FILTER_PRODUCTS = gql`
  ${PRODUCT_SECTION_FRAGMENT}
  query getProducts(
    $filter: String
    $sortKey: String
    $reverse: Boolean
    $first: Int
    $after: String
    $before: String
  ) {
    products(
      filter: $filter
      sortKey: $sortKey
      reverse: $reverse
      first: $first
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
          ...ProductSection
        }
      }
    }
  }
`;
