import { productInfoFragment } from '../fragments/product'

export const getAllProductsQuery = /* GraphQL */ `
  query getProductListing(
    $input: FilterProductListingInput
    $first: Int = 10
    $page: Int = 1
  ) {
    getProductListing(input: $input, first: $first, page: $page) {
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
`
