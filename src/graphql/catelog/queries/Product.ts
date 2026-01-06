import { gql } from "@apollo/client";
import {
  PRODUCT_CORE_FRAGMENT,
  PRODUCT_DETAILED_FRAGMENT,
  PRODUCT_SECTION_FRAGMENT,
} from "../fragments";

/**
 * Fetch paginated products with filtering and sorting
 * @param query - Search query string
 * @param sortKey - Field to sort by
 * @param reverse - Sort in reverse order
 * @param first - Number of items to fetch
 * @param after - Cursor for forward pagination
 * @param before - Cursor for backward pagination
 * @param channel - Sales channel
 * @param locale - Locale for localized content
 */
export const GET_PRODUCTS = gql`
  ${PRODUCT_CORE_FRAGMENT}

  query GetProducts(
    $query: String
    $sortKey: String
    $reverse: Boolean
    $first: Int
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

/**
 * Fetch a single product by ID with all details
 * @param id - Product ID
 */
export const GET_PRODUCT_BY_ID = gql`
  ${PRODUCT_DETAILED_FRAGMENT}

  query GetProductById($id: ID!) {
    product(id: $id) {
      ...ProductDetailed
    }
  }
`;

export const GET_PRODUCT_SWATCH_REVIEW = gql`
  query ProductSwatchReview($id: ID!) {
    product(id: $id) {
      id
      name
      sku
      type
      urlKey
      price
      isSaleable
      index
      attributeValues {
        edges {
          cursor
          node {
            value
            attribute {
              adminName
              code
              isFilterable
              isVisibleOnFront
            }
          }
        }
      }
      superAttributes {
        edges {
          node {
            id
            code
            adminName
            options {
              edges {
                node {
                  id
                  adminName
                }
              }
            }
          }
        }
      }
    }
  }
`;


/**
 * Fetch pagination info for products
 * Lightweight query for pagination controls
 */
export const GET_PRODUCTS_PAGINATION = gql`
  query GetProductsPagination(
    $query: String
    $sortKey: String
    $reverse: Boolean
    $first: Int
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

/**
 * Fetch related products for a given product
 * @param id - Product ID
 * @param first - Number of related products to fetch
 */
export const GET_RELATED_PRODUCTS = gql`
  ${PRODUCT_SECTION_FRAGMENT}

  query GetRelatedProducts($id: ID!, $first: Int) {
    product(id: $id) {
      id
      sku
      relatedProducts(first: $first) {
        edges {
          node {
            ...ProductSection
          }
        }
      }
    }
  }
`;
