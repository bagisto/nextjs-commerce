export const GET_COMPARE_ITEMS = `
  query GetCompareItems($first: Int, $after: String) {
    compareItems(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          _id
          product {
            id
            _id
            sku
            urlKey
            type
            name
            description
            shortDescription
            price
            minimumPrice
            maximumPrice
            guestCheckout
            locale
            channel
            baseImageUrl
            reviews {
              edges {
                node {
                  name
                  id
                  title
                  rating
                }
              }
              totalCount
            }
          }
          customer {
            id
            firstName
            lastName
            gender
            dateOfBirth
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
