export const getPageQuery = /* GraphQL */ `
  query cmsPages($input: FilterCmsPageInput) {
    cmsPages(input: $input) {
      data {
        id
        layout
        createdAt
        updatedAt
        translations {
          id
          urlKey
          metaDescription
          metaTitle
          pageTitle
          metaKeywords
          htmlContent
          locale
          cmsPageId
        }
      }
    }
  }
`;

export const getPagesQuery = /* GraphQL */ `
  query CmsPages {
    cmsPages(first: 100) {
      data {
        updatedAt
        translations {
          urlKey
        }
      }
    }
  }
`;

export const getCountryQuery = /* GraphQL */ `
  query Countries {
    countries(first: 200, page: 1) {
      data {
        id
        code
        name
        states {
          id
          countryCode
          code
          defaultName
          countryId
        }
      }
    }
  }
`;

export const getThemeCustomizationQuery = /* GraphQL */ `
  query themeCustomization {
    themeCustomization {
      id
      channelId
      type
      name
      sortOrder
      status
      baseUrl
      translations {
        id
        themeCustomizationId
        locale
        options {
          css
          html
          title
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
          images {
            link
            image
            imageUrl
          }
          filters {
            key
            value
          }
        }
      }
    }
  }
`;
