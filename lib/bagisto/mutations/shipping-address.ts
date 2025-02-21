export const addShippingAddressMutation = /* GraphQL */ `
  mutation saveCheckoutAddresses($input: SaveShippingAddressInput!) {
    saveCheckoutAddresses(input: $input) {
      shippingMethods {
        title
        methods {
          code
          label
          price
          formattedPrice
          basePrice
          formattedBasePrice
        }
      }
      cart {
        id
        customerEmail
        customerFirstName
        customerLastName
        shippingMethod
        couponCode
        isGift
        itemsCount
        itemsQty
      }
    }
  }
`;
