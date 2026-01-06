import { gql } from "@apollo/client";

export const PRODUCT_CORE_FRAGMENT = gql`
  fragment ProductCore on Product {
    id
    sku
    type
    name
    price
    urlKey
    baseImageUrl
    minimumPrice
    specialPrice
  }
`;

export const PRODUCT_DETAILED_FRAGMENT = gql`
  fragment ProductDetailed on Product {
    id
    sku
    type
    name
    urlKey
    description
    shortDescription
    price
    baseImageUrl
    minimumPrice
     specialPrice
    variants {
      edges {
        node {
          id
          sku
          baseImageUrl
        }
      }
    }
    reviews {
        edges {
          node {
            rating
            id
            name
            title
            comment
          }
        }
      }
  }
`;

export const PRODUCT_REVIEW_FRAGMENT = gql`
  fragment ProductReview on Review {
    rating
    id
    _id
    name
    title
    comment
  }
`;

export const PRODUCT_SECTION_FRAGMENT = gql`
  fragment ProductSection on Product {
    id
    sku
    name
    urlKey
    type
    baseImageUrl
    price
    minimumPrice
  }
`;
