import seoFragment from '../fragments/seo';

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
  }
  ${seoFragment}
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
`;

import { productInfoFragment } from '../fragments/product';

export const getCollectionProductsQuery = /* GraphQL */ `
  query allProducts($input: [FilterAllProductsInput], $first: Int = 48, $page: Int = 1) {
    allProducts(input: $input, first: $first, page: $page) {
      paginatorInfo {
        count
        currentPage
        lastPage
        total
      }
      data {
        ...productInfo
      }
    }
  }

  ${productInfoFragment}
`;
