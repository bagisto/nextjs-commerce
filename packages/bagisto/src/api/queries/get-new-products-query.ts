export const getNewProductsQuery = /* GraphQL */ `
  query newProducts {
    newProducts {
      id
      type
      isInWishlist
      attributeFamilyId
      sku
      parentId
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
        special
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
