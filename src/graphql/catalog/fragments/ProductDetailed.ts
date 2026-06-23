import { gql } from "@apollo/client";

export const PRODUCT_DETAILED_FRAGMENT = gql`
  fragment ProductDetailed on Product {
    id
    sku
    type
    name
    urlKey
categories {
      edges {
        node {
          _id
          displayMode
          additional
          translation {
            name
            slug
          }
        }
      }
    }
    description
    shortDescription
    price
    baseImageUrl
    images(first: 10) {
      edges {
        node {
          id
          publicPath
          position
        }
      }
    }
    minimumPrice
    specialPrice
    isSaleable
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
    variants {
      edges {
        node {
          id
          sku
          baseImageUrl
        }
      }
    }
      reviews {
      edges {
        node {
          rating
        }
      }
    }
  }
`;
