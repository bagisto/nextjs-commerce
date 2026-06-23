export const CREATE_COMPARE_ITEM = `
  mutation CreateCompareItem($input: createCompareItemInput!) {
    createCompareItem(input: $input) {
      compareItem {
        id
        _id
        createdAt
        updatedAt
        product {
          id
          _id
          sku
          type
          name
          description
          shortDescription
          price
          formattedPrice
          minimumPrice
          formattedMinimumPrice
          maximumPrice
          formattedMaximumPrice
          guestCheckout
          locale
          channel
        }
        customer {
          id
          firstName
          lastName
          gender
          dateOfBirth
        }
      }
    }
  }
`;
