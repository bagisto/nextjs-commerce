import { gql } from "@apollo/client";

export const GET_TREE_CATEGORIES = gql`
  query treeCategories($parentId: Int) {
    treeCategories(parentId: $parentId) {
      id
      position
      logoPath
      status
      translation{
        id
        name
        slug
        description
        urlPath
        metaTitle
      }
    }
  }
`;
