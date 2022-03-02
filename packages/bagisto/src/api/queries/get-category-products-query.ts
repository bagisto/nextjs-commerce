export const getFeaturedProductsQuery = /* GraphQL */ `
  query featuredProducts {
    featuredProducts {
      productFlats {
        id
        productId
        name
        urlKey
        price
        description
      }
      images {
        id
        path
        url
      }
    }
  }
`

export const getNewProductsQuery = /* GraphQL */ `
  query newProducts {
    newProducts {
      productFlats {
        id
        productId
        name
        urlKey
        price
        description
      }
      images {
        id
        path
        url
      }
    }
  }
`
