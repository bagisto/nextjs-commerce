export const saveAddressMutation = /* GraphQL */ `
  mutation saveCheckoutAddresses($input: SaveShippingAddressInput!) {
    saveCheckoutAddresses(input: $input) {
      success
      cartTotal
      cartCount
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
      paymentMethods {
        method
        method_title
        description
        sort
      }
      jumpToSection
    }
  }
`
