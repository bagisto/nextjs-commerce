export const GET_CUSTOMER_REVIEWS = `
  query getCustomerReviews($first: Int, $after: String) {
    customerReviews(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          _id
          title
          comment
          rating
          status
          name
          product {
            id
            _id
            sku
            type
            urlKey
            name
             baseImageUrl
        
            
          }
          customer {
            id
            _id
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
