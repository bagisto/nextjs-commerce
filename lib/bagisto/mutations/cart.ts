import cartFragment from '../fragments/cart';

export const addToCartMutation = /* GraphQL */ `
  mutation addItemToCart($input: AddItemToCartInput!) {
    addItemToCart(input: $input) {
      status
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
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const editCartItemsMutation = /* GraphQL */ `
  mutation updateItemToCart($input: UpdateItemToCartInput!) {
    updateItemToCart(input: $input) {
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
`;

export const removeFromCartMutation = /* GraphQL */ `
  mutation removeCartItem($lineIds: ID!) {
    removeCartItem(id: $lineIds) {
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
`;
