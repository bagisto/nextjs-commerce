import { gql } from "@apollo/client";

export const GET_TREE_CATEGORIES = gql`
  query treeCategories($parentId: Int) {
    treeCategories(parentId: $parentId) {
      id
      position
      logoPath
      status
      translations {
        edges {
          node {
            name
            slug
            urlPath
            description
            metaTitle
          }
        }
      }
    }
  }
`;
