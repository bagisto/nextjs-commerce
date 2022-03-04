import { productInfoFragment } from '../../fragments/product'

export const getNewProductsQuery = /* GraphQL */ `
  query newProducts {
    newProducts {
      ...productInfo
    }
  }

  ${productInfoFragment}
`
