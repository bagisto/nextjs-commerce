export const getFilterAttribute = /* GraphQL */ `
  query GetFilterAttribute {
    getFilterAttribute {
      filterData {
        key
        value
      }
      sortOrders {
        key
        title
        value
        sort
        order
        position
      }
    }
  }
`;
