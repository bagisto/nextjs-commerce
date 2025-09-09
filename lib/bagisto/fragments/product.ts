import imageFragment from "./image";
import seoFragment from "./seo";

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    shortDescription
    descriptionHtml
    isSaleable
    booking {
      id
      type
      qty
      location
      showLocation
      availableEveryWeek
      availableFrom
      availableTo
      productId
      defaultSlot {
        id
        bookingType
        duration
        breakTime
        slotManyDays {
          id
          to
          toDay
          from
          fromDay
          status
        }
        slotOneDay {
          id
          to
          toDay
          from
          fromDay
          status
        }
        bookingProductId
      }
      appointmentSlot {
        id
        duration
        breakTime
        sameSlotAllDays
        slotManyDays {
          id
          to
          toDay
          from
          fromDay
          status
          day
        }
        slotOneDay {
          id
          to
          toDay
          from
          fromDay
          status
          day
        }
        bookingProductId
      }
      eventTickets {
        id
        price
        qty
        name
        description
        specialPrice
        specialPriceFrom
        specialPriceTo
        translations {
          locale
          name
          description
        }
        bookingProductId
      }
      rentalSlot {
        id
        rentingType
        dailyPrice
        hourlyPrice
        sameSlotAllDays
        slotManyDays {
          id
          to
          toDay
          from
          fromDay
          status
          day
        }
        slotOneDay {
          id
          to
          toDay
          from
          fromDay
          status
          day
        }
        bookingProductId
      }
      tableSlot {
        id
        priceType
        guestLimit
        duration
        breakTime
        preventSchedulingBefore
        sameSlotAllDays
        slotManyDays {
          id
          to
          toDay
          from
          fromDay
          status
          day
        }
        slotOneDay {
          id
          to
          toDay
          from
          fromDay
          status
          day
        }
        bookingProductId
      }
    }
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
    status
    isInWishlist
    attributeFamilyId
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
    cacheGalleryImages {
      smallImageUrl
      mediumImageUrl
      largeImageUrl
      originalImageUrl
    }
    relatedProducts {
      id
      name
      urlKey
      type
      priceHtml {
        regularPrice
        currencyCode
      }
      images {
        url
      }
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
          formattedPrice
        }
        finalPrice {
          price
          formattedPrice
        }
      }

      chooseText
      regularPrice {
        formattedPrice
        price
      }
    }
  }
`;
