import imageFragment from './image';
import seoFragment from './seo';

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    isSaleable
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;

export const productInfoFragment = /* GraphQL */ `
  fragment productInfo on Product {
    id
    type
    name
    shortDescription
    description
    metaTitle
    metaKeywords
    metaDescription
    weight
    isInWishlist
    attributeFamilyId
    additionalData {
      id
      code
      label
      value
      admin_name
      type
    }
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
      bundlePrice {
        finalPriceFrom
        formattedFinalPriceFrom
        regularPriceFrom
        formattedRegularPriceFrom
        finalPriceTo
        formattedFinalPriceTo
        regularPriceTo
        formattedRegularPriceTo
      }
    }
    urlKey
    updatedAt
    parentId

    variants {
      id
      type
      attributeFamilyId
      urlKey
      parentId
    }
    parent {
      id
      type
      attributeFamilyId
      urlKey
      parentId
    }
    attributeFamily {
      id
      code
      name
      status
      isUserDefined
    }
    attributeValues {
      id
      productId
      attributeId
      locale
      channel
      textValue
      booleanValue
      integerValue
      floatValue
      dateTimeValue
      dateValue
      jsonValue
      attribute {
        id
        code
        adminName
        type
      }
    }
    relatedProducts {
      id
      name
      urlKey
      priceHtml {
        regularPrice
        currencyCode
      }
      images {
        url
      }
    }
    superAttributes {
      id
      code
      adminName
      type
      position
    }
    categories {
      id
      name
      description
      slug
      logoPath
      bannerPath
      metaTitle
      metaDescription
      metaKeywords
      position
      status
      displayMode
      parentId
      filterableAttributes {
        id
        adminName
        code
        type
        position
      }
      # translations {
      #   id
      #   name
      #   description
      #   localeId
      #   locale
      # }
      createdAt
      updatedAt
    }
    inventories {
      id
      qty
      productId
      inventorySourceId
      vendorId
      inventorySource {
        id
        code
        name
        description
        contactName
        contactEmail
        contactNumber
        contactFax
        country
        state
        city
        street
        postcode
        priority
        latitude
        longitude
        status
      }
    }
    images {
      id
      path
      url
      productId
    }
    videos {
      id
      type
      path
      url
      productId
    }
    orderedInventories {
      id
      qty
      productId
      channelId
    }
    # reviews {
    #   id
    #   title
    #   rating
    #   comment
    #   status
    #   productId
    #   customerId
    #   customerName
    #   createdAt
    #   updatedAt
    # }
    groupedProducts {
      id
      qty
      sortOrder
      productId
      associatedProductId
      associatedProduct {
        id
        type
        attributeFamilyId
        urlKey
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
        parentId
      }
    }
    downloadableSamples {
      id
      url
      fileUrl
      file
      fileName
      type
      sortOrder
      productId
      createdAt
      updatedAt
      translations {
        id
        locale
        title
        productDownloadableSampleId
      }
    }
    downloadableLinks {
      id
      title
      price
      url
      fileUrl
      file
      fileName
      type
      sampleUrl
      sampleFile
      sampleFileUrl
      sampleFileName
      sampleType
      sortOrder
      productId
      downloads
      translations {
        id
        locale
        title
        productDownloadableLinkId
      }
    }
    bundleOptions {
      id
      type
      isRequired
      sortOrder
      productId
      bundleOptionProducts {
        id
        qty
        isUserDefined
        sortOrder
        isDefault
        productBundleOptionId
        productId
        product {
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
            bundlePrice {
              finalPriceFrom
              formattedFinalPriceFrom
              regularPriceFrom
              formattedRegularPriceFrom
              finalPriceTo
              formattedFinalPriceTo
              regularPriceTo
              formattedRegularPriceTo
            }
          }
        }
      }
      translations {
        id
        locale
        label
        productBundleOptionId
      }
    }
    customerGroupPrices {
      id
      qty
      valueType
      value
      productId
      customerGroupId
      createdAt
      updatedAt
    }
    configutableData {
      attributes {
        id
        code
        label
        swatchType
        options {
          id
          label
          swatchType
          swatchValue
          products
        }
      }
      index {
        id
        attributeOptionIds {
          attributeId
          attributeCode
          attributeOptionId
        }
      }
      variantPrices {
        id
        regularPrice {
          price
          formatedPrice
        }
        finalPrice {
          price
          formatedPrice
        }
      }
      variantImages {
        id
        images {
          smallImageUrl
          mediumImageUrl
          largeImageUrl
          originalImageUrl
        }
      }
      variantVideos {
        id
        videos
      }
      chooseText
      regularPrice {
        formatedPrice
        price
      }
    }
  }
`;
