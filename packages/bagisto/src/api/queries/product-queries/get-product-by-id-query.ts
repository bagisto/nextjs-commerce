import { productInfoFragment } from '../../fragments/product'

export const getProductById = /* GraphQL */ `
  query product($id: ID!) {
    product(id: $id) {
      ...productInfo
    }
  }

  ${productInfoFragment}
`
