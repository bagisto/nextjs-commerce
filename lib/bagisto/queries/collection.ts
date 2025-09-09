import seoFragment from "../fragments/seo";

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

import { productInfoFragment } from "../fragments/product";

export const getCollectionProductQuery = /* GraphQL */ `
  query allProducts($input: [FilterHomeCategoriesInput]) {
    allProducts(input: $input) {
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

export const getCollectionSeoQuery = /* GraphQL */ `
  query allProducts($input: [FilterHomeCategoriesInput]) {
    allProducts(input: $input) {
      paginatorInfo {
        count
        currentPage
        lastPage
        total
      }
      data {
        id
        type
        name
        shortDescription
        description
        metaTitle
        metaKeywords
        metaDescription
      }
    }
  }
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query allProducts($input: [FilterHomeCategoriesInput]) {
    allProducts(input: $input) {
      paginatorInfo {
        count
        currentPage
        lastPage
        total
      }
      data {
        id
        type
        name
        priceHtml {
          id
          type
          priceHtml
          priceWithoutHtml
          minPrice
          regularPrice
          formattedRegularPrice
          finalPrice
          formattedFinalPrice
          currencyCode
        }
        urlKey
        images {
          id
          path
          url
          productId
        }
        cacheGalleryImages {
          smallImageUrl
          mediumImageUrl
          largeImageUrl
          originalImageUrl
        }
      }
    }
  }
`;
