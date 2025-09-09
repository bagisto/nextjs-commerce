export const getHomeProductQuery = /* GraphQL */ `
  query ProductCarousel($input: [FilterHomeCategoriesInput]) {
    allProducts(input: $input) {
      paginatorInfo {
        count
        currentPage
        lastPage
        total
      }
      data {
        id
        type
        name
        new
        status
        guestCheckout
        urlKey
        percentageRating
        images {
          id
          type
          path
          url
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
          priceHtml
          regularPrice
          formattedRegularPrice
          finalPrice
          formattedFinalPrice
          currencyCode
        }
      }
    }
  }
`;
