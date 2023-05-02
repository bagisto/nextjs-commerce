export const saveAddressesMutation = /* GraphQL */ `
  mutation saveCheckoutAddresses($input: SaveShippingAddressInput!) {
    saveCheckoutAddresses(input: $input) {
      success
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
