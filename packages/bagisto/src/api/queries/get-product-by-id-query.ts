export const getProductById = /* GraphQL */ `
  query product($id: ID!) {
    product(id: $id) {
      id
      type
      isInWishlist
      attributeFamilyId
      sku
      parentId
      superAttributes {
        id
        code
        adminName
        type
        position
      }
      configutableData {
        index {
          id
          attributeOptionIds {
            attributeId
            attributeOptionId
          }
        }
        attributes {
          id
          code
          label
          options {
            id
            label
          }
        }
      }
      productFlats {
        id
        sku
        productNumber
        name
        description
        shortDescription
        urlKey
        new
        featured
        status
        visibleIndividually
        thumbnail
        price
        cost
        specialPrice
        specialPriceFrom
        specialPriceTo
        weight
        color
        colorLabel
        size
        sizeLabel
        locale
        channel
        productId
        parentId
        minPrice
        maxPrice
        metaTitle
        metaKeywords
        metaDescription
        width
        height
        depth
        createdAt
        updatedAt
      }
      cacheBaseImage {
        smallImageUrl
        mediumImageUrl
        largeImageUrl
        originalImageUrl
      }
      cacheGalleryImages {
        smallImageUrl
        mediumImageUrl
        largeImageUrl
        originalImageUrl
      }
      priceHtml {
        id
        type
        html
        regular
        regularWithoutCurrencyCode
        special
        specialWithoutCurrencyCode
        currencyCode
      }
      reviews {
        id
        title
        rating
        comment
        status
        productId
        customerId
        customerName
        createdAt
        updatedAt
      }
    }
  }
`
