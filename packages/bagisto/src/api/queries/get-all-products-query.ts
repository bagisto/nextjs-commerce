export const getAllProductsQuery = /* GraphQL */ `
  query products {
    products {
      paginatorInfo {
        count
        currentPage
        lastPage
        total
      }
      data {
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
  }
`
