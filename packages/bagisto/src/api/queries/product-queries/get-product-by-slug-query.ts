import { productInfoFragment } from '../../fragments/product'

export const getProductBySlug = /* GraphQL */ `
  query product($slug: String!) {
    productBySlug(slug: $slug) {
      product {
        ...productInfo
      }
    }
  }

  ${productInfoFragment}
`
