export const getFilterAttributesQuery = /* GraphQL */ `
  query GetFilterAttribute($categorySlug: String!) {
    getFilterAttribute(categorySlug: $categorySlug) {
      minPrice
      maxPrice
      filterAttributes {
        id
        adminName
        type
        swatchType
        isComparable
        code
        options {
          id
          adminName
          swatchValue
          sortOrder
          attributeId
          isNew
          isDelete
          position
          translations {
            id
            locale
            label
            attributeOptionId
          }
        }
      }
      sortOrders {
        key
        title
        value
        sort
        order
        position
      }
    }
  }
`;
