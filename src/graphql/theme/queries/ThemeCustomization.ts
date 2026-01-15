import { gql } from "@apollo/client";

export const GET_THEME_CUSTOMIZATION = gql`
  query themeCustomization($first: Int) {
    themeCustomizations(first: $first) {
      edges {
        node {
          id
          type
          name
          status
          sortOrder
          translations {
            edges {
              node {
                id
                themeCustomizationId
                locale
                options
              }
            }
          }
        }
      }
    }
  }
`;
