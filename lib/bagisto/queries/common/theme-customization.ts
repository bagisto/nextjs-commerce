export const getHomeCustomizationQuery = /* GraphQL */ `
  query ThemeCustomization {
    themeCustomization {
      id
      themeCode
      type
      name
      sortOrder
      status
      channelId
      translations {
        id
        themeCustomizationId
        localeCode
        options {
          title
          css
          html
          images {
            title
            link
            image
            imageUrl
          }
          filters {
            key
            value
          }
          column_1 {
            url
            title
            sortOrder
          }
          column_2 {
            url
            title
            sortOrder
          }
          column_3 {
            url
            title
            sortOrder
          }
        }
      }
    }
  }
`;
