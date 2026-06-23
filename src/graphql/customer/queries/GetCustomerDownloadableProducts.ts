import { gql } from "@apollo/client";

export const GET_CUSTOMER_DOWNLOADABLE_PRODUCTS = gql`
  query GetCustomerDownloadableProducts($first: Int, $after: String) {
    customerDownloadableProducts(first: $first, after: $after) {
      edges {
        cursor
        node {
          _id
          productName
          name
          fileName
          type
          downloadBought
          downloadUsed
          downloadCanceled
          status
          downloadUrl
          remainingDownloads
          order {
            _id
            incrementId
            status
          }
          createdAt
          updatedAt
        }
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;
