export const addShippingMethodMutation = /* GraphQL */ `
  mutation saveShipping($input: saveShippingMethodInput!) {
    saveShipping(input: $input) {
      message
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
