import { gql } from "@apollo/client";
import { PRODUCT_CORE_FRAGMENT } from "../fragments";

export const GET_RELATED_PRODUCTS = gql`
  ${PRODUCT_CORE_FRAGMENT}

  query GetRelatedProducts($urlKey: String, $first: Int) {
    product(urlKey: $urlKey) {
      id
      sku
      relatedProducts(first: $first) {
        edges {
          node {
            ...ProductCore
          }
        }
      }
    }
  }
`;
