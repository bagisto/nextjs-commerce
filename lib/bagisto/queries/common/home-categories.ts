export const getHomeCategoriesQuery = /* GraphQL */ `
  query HomeCategories(
    $getCategoryTree: Boolean
    $input: [FilterHomeCategoriesInput]
  ) {
    homeCategories(getCategoryTree: $getCategoryTree, input: $input) {
      id
      logoPath
      logoUrl
      name
      slug
    }
  }
`;
