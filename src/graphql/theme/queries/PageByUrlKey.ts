import { gql } from "@apollo/client";

export const PAGE_BY_URL_KEY = gql`
  query PageByUrlKey($pageByUrlKey: String!) {
    pageByUrlKeypages(urlKey: $pageByUrlKey) {
      id
      updatedAt
      translation {
        id
        metaTitle
        pageTitle
        urlKey
        htmlContent
        cmsPageId
      }
    }
  }
`;
