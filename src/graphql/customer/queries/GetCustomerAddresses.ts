export const GET_CUSTOMER_ADDRESSES = `
  query getCustomerAddresses($first: Int, $after: String) {
    getCustomerAddresses(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          _id
          addressType
          companyName
          name
          firstName
          lastName
          email
          address
          city
          state
          country
          postcode
          phone
          vatId
          defaultAddress
          useForShipping
          additional
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;
