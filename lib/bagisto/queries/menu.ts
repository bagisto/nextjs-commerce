export const getMenuQuery = /* GraphQL */ `
  query homeCategories {
    homeCategories(
      input: [
        { key: "parent_id", value: "1" }
        { key: "locale", value: "en" }
        { key: "status", value: "1" }
        { key: "limit", value: "3" }
      ]
      getCategoryTree: false
    ) {
      id
      logoUrl
      bannerPath
      name
      slug
      description
      metaTitle
      metaDescription
      metaKeywords
    }
  }
`;
