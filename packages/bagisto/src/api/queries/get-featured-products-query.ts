import { productInfoFragment } from '../fragments/product'

export const getFeaturedProductsQuery = /* GraphQL */ `
  query featuredProducts {
    featuredProducts {
      ...productInfo
    }
  }

  ${productInfoFragment}
`
