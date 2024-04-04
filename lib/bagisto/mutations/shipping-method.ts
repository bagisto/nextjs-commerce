export const addShippingMethodMutation = /* GraphQL */ `
  mutation PaymentMethodInput($input: SaveShippingMethodInput!) {
    paymentMethods(input: $input) {
      success
      paymentMethods {
        method
        methodTitle
        description
        sort
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
