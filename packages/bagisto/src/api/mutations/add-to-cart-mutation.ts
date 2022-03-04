export const addSimpleProductMutation = /* GraphQL */ `
  mutation addItemToCart($productId: ID!, $quantity: Int!) {
    addItemToCart(input: { productId: $productId, quantity: $quantity }) {
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
        exchangeRate
        globalCurrencyCode
        baseCurrencyCode
        channelCurrencyCode
        cartCurrencyCode
        grandTotal
        baseGrandTotal
        subTotal
        baseSubTotal
        taxTotal
        baseTaxTotal
        discountAmount
        baseDiscountAmount
        checkoutMethod
        isGuest
        isActive
        conversionTime
        customerId
        channelId
        appliedCartRuleIds
        createdAt
        updatedAt
      }
    }
  }
`

export const addConfigurableProductMutation = /* GraphQL */ `
  mutation addItemToCart($input: AddItemToCartInput!) {
    addItemToCart(input: $input) {
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
        exchangeRate
        globalCurrencyCode
        baseCurrencyCode
        channelCurrencyCode
        cartCurrencyCode
        grandTotal
        baseGrandTotal
        subTotal
        baseSubTotal
        taxTotal
        baseTaxTotal
        discountAmount
        baseDiscountAmount
        checkoutMethod
        isGuest
        isActive
        conversionTime
        customerId
        channelId
        appliedCartRuleIds
        createdAt
        updatedAt
      }
    }
  }
`
