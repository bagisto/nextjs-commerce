export const removeCartItemMutation = /* GraphQL */ `
  mutation removeCartItem($itemId: ID!) {
    removeCartItem(id: $itemId) {
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
