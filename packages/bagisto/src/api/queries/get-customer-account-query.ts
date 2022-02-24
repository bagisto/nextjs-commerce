export const getCustomerAccountQuery = /* GraphQL */ `
  query accountInfo {
    accountInfo {
      customer {
        id
        firstName
        lastName
        email
      }
    }
  }
`
