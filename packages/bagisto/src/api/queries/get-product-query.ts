export const getProductQuery = /* GraphQL */ `
  query products {
    products(input: { id: 1 }) {
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
