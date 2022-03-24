export const getCategoriesQuery = /* GraphQL */ `
  query homeCategories {
    homeCategories {
      id
      name
      description
      slug
      urlPath
      image
      imageUrl
      metaTitle
      metaDescription
      metaKeywords
      position
      status
      displayMode
      parentId
      additional
      filterableAttributes {
        id
        code
        adminName
        type
        validation
        position
        isFilterable
      }
      translations {
        id
        name
        slug
        description
        metaTitle
        metaDescription
        metaKeywords
        category_id
        locale
        localeId
        urlPath
      }
      createdAt
      updatedAt
      count
    }
  }
`
