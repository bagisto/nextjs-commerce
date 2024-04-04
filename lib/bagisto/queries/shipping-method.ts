export const getShippingMethodQuery = /* GraphQL */ `
  query shippingMethods {
    shippingMethods {
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
        # method_title
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
      jumpToSection
    }
  }
`;
