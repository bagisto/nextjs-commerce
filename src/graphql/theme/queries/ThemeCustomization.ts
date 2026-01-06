import { gql } from "@apollo/client";

export const GET_THEME_CUSTOMIZATION = gql`
  query themeCustomization {
    themeCustomizations {
      edges {
        node {
          id
          type
          name
          status
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
