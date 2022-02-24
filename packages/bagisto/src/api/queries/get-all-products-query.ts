export const getAllProductsQuery = /* GraphQL */ `
  query newProducts {
    newProducts(count: 6) {
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
