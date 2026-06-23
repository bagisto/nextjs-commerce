import { gql } from "@apollo/client";
import { PRODUCT_DETAILED_FRAGMENT } from "../fragments";

export const GET_PRODUCT_BY_URL_KEY = gql`
  ${PRODUCT_DETAILED_FRAGMENT}

  query GetProductById($urlKey: String!) {
    product(urlKey: $urlKey) {
      ...ProductDetailed
    }
  }
`;
