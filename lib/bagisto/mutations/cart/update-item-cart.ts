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
