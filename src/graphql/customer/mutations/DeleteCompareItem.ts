export const DELETE_COMPARE_ITEM = `
  mutation DeleteCompareItem($input: deleteCompareItemInput!) {
    deleteCompareItem(input: $input) {
      compareItem {
        id
        _id
        product {
          id
          _id
          sku
          type
          name
          price
          minimumPrice
        }
      }
    }
  }
`;
