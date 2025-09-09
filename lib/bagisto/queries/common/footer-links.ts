export const getThemeFooterLinksQuery = /* GraphQL */ `
  query themeCustomization {
    themeCustomization {
      id
      type
      name
      status
      translations {
        id
        options {
          services {
            title
            description
            serviceIcon
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
