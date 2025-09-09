export const getProductsUrlQuery = /* GraphQL */ `
  query allProducts($input: [FilterHomeCategoriesInput]) {
    allProducts(input: $input) {
      data {
        id
        type
        name
        urlKey
      }
    }
  }
`;
