export const getMenuQuery = /* GraphQL */ `
  query homeCategories {
    homeCategories(
      input: [
        { key: "parent_id", value: "1" }
        { key: "locale", value: "en" }
        { key: "status", value: "1" }
      ]
    ) {
      id
      # categoryId
      position
      logoPath
      logoUrl
      status
      displayMode
      lft
      rgt
      parentId
      additional
      bannerPath
      bannerUrl
      name
      slug
      urlPath
      description
      metaTitle
      metaDescription
      metaKeywords
      localeId
      createdAt
      updatedAt
      filterableAttributes {
        id
        adminName
        code
        type
        position
      }
      children {
        id
        name
        description
        slug
        urlPath
        logoPath
        logoUrl
        bannerPath
        bannerUrl
        metaTitle
        metaDescription
        metaKeywords
        position
        status
        displayMode
        parentId
      }
    }
  }
`;
