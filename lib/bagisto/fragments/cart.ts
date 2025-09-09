import productFragment from "./product";

const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
  {
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
    customerId
    channelId
    appliedCartRuleIds
    createdAt
    updatedAt
    }
  }
  ${productFragment}
`;

export default cartFragment;
