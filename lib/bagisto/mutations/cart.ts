// Create the add to cart items.
export const addToCartMutation = /* GraphQL */ `
  mutation addItemToCart($input: AddItemToCartInput!) {
    addItemToCart(input: $input) {
      message
      success
      cart {
        id
        status
        message
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
        items {
          id
          type
          quantity
          sku
          type
          name
          couponCode
          price
          basePrice
          total
          baseTotal
          taxPercent
          taxAmount
          baseTaxAmount
          discountPercent
          discountAmount
          baseDiscountAmount
          parentId
          productId
          cartId
          taxCategoryId
          customPrice
          appliedCartRuleIds
          product {
            id
            sku
            type
            parentId
            guestCheckout
            name
            shortDescription
            description
            urlKey
            name
            priceHtml {
              id
              type
              minPrice
              priceHtml
              priceWithoutHtml
              regularPrice
              formattedRegularPrice
              finalPrice
              formattedFinalPrice
              currencyCode
            }
            cacheGalleryImages {
              smallImageUrl
              mediumImageUrl
              largeImageUrl
              originalImageUrl
            }
            images {
              id
              type
              path
              url
              productId
            }
          }
        }

        formattedPrice {
          grandTotal
          baseGrandTotal
          subTotal
          baseSubTotal
          taxTotal
          baseTaxTotal
          discount
          baseDiscount
          discountedSubTotal
          baseDiscountedSubTotal
        }
      }
    }
  }
`;

// Edit the Existing the add to cart Items (Increament and Decreament Action).
export const editCartItemsMutation = /* GraphQL */ `
  mutation UpdateItemToCart($input: UpdateItemToCartInput!) {
    updateItemToCart(input: $input) {
      success
      message
      cart {
        id
        status
        message
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
        items {
          id
          type
          quantity
          sku
          type
          name
          couponCode
          price
          basePrice
          total
          baseTotal
          taxPercent
          taxAmount
          baseTaxAmount
          discountPercent
          discountAmount
          baseDiscountAmount
          parentId
          productId
          cartId
          taxCategoryId
          customPrice
          appliedCartRuleIds
          product {
            id
            sku
            type
            parentId
            guestCheckout
            name
            shortDescription
            description
            urlKey
            name
            priceHtml {
              id
              type
              minPrice
              priceHtml
              priceWithoutHtml
              regularPrice
              formattedRegularPrice
              finalPrice
              formattedFinalPrice
              currencyCode
            }

            cacheGalleryImages {
              smallImageUrl
            }
            images {
              id
              type
              path
              url
              productId
            }
          }
        }

        formattedPrice {
          grandTotal
          baseGrandTotal
          subTotal
          baseSubTotal
          taxTotal
          baseTaxTotal
          discount
          baseDiscount
          discountedSubTotal
          baseDiscountedSubTotal
        }
      }
    }
  }
`;

// Remove action to the cart Items.
export const removeFromCartMutation = /* GraphQL */ `
  mutation removeCartItem($id: ID!) {
    removeCartItem(id: $id) {
      success
      message
      cart {
        id
        status
        message
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
        items {
          id
          type
          quantity
          sku
          type
          name
          couponCode
          price
          basePrice
          total
          baseTotal
          taxPercent
          taxAmount
          baseTaxAmount
          discountPercent
          discountAmount
          baseDiscountAmount
          parentId
          productId
          cartId
          taxCategoryId
          customPrice
          appliedCartRuleIds
          product {
            id
            sku
            type
            parentId
            guestCheckout
            name
            shortDescription
            description
            urlKey
            name
            priceHtml {
              id
              type
              minPrice
              priceHtml
              priceWithoutHtml
              regularPrice
              formattedRegularPrice
              finalPrice
              formattedFinalPrice
              currencyCode
            }

            cacheGalleryImages {
              smallImageUrl
            }
            images {
              id
              type
              path
              url
              productId
            }
          }
        }

        formattedPrice {
          grandTotal
          baseGrandTotal
          subTotal
          baseSubTotal
          taxTotal
          baseTaxTotal
          discount
          baseDiscount
          discountedSubTotal
          baseDiscountedSubTotal
        }
      }
    }
  }
`;
