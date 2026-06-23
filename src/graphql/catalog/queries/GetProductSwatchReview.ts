import { gql } from "@apollo/client";

export const GET_PRODUCT_SWATCH_REVIEW = gql`
  query ProductSwatchReview($urlKey: String!) {
    product(urlKey: $urlKey) {
      id
      name
      sku
      type
      urlKey
      price
      specialPrice
      minimumPrice
      isSaleable
      combinations
      groupedProducts {
        edges {
          node {
            id
            qty
            sortOrder
            associatedProduct {
              id
              name
              sku
              price
              formattedPrice
              specialPrice
              formattedSpecialPrice
              images(first: 3) {
                edges {
                  node {
                    id
                    publicPath
                  }
                }
              }
            }
          }
        }
      }
      bundleOptions {
        edges {
          node {
            id
            type
            isRequired
            sortOrder
            translation {
              label
            }
            bundleOptionProducts {
              edges {
                node {
                  id
                  qty
                  isDefault
                  isUserDefined
                  sortOrder
                  product {
                    id
                    name
                    sku
                    price
                    images(first: 3) {
                      edges {
                        node {
                          id
                          publicPath
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      superAttributeOptions
      downloadableLinks {
        edges {
          node {
            _id
            type
            translation {
              title
            }
            price
            formattedPrice
            sampleType
            sampleFile
            sampleFileUrl
            sampleUrl
          }
        }
      }
      downloadableSamples {
        edges {
          node {
            _id
            type
            file
            fileUrl
            url
            translation {
              title
            }
          }
        }
      }
      attributeValues {
        edges {
          cursor
          node {
            value
            attribute {
              adminName
              code
              isFilterable
              isVisibleOnFront
            }
          }
        }
      }
      superAttributes {
        edges {
          node {
            id
            code
            adminName
            options {
              edges {
                node {
                  id
                  adminName
                }
              }
            }
          }
        }
      }
      bookingProducts {
        edges {
          node {
            _id
            type
            availableFrom
            availableTo
            qty
            location
            availableEveryWeek
          }
        }
      }
    }
  }
`;
