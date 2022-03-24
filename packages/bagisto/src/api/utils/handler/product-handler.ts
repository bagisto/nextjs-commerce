import { normalizeProduct } from '../../lib/normalize'
import { getAllProductsQuery } from '../../queries/product-queries/get-all-products-query'
import { getProductById } from '../../queries/product-queries/get-product-by-id-query'
import { getProductBySlug } from '../../queries/product-queries/get-product-by-slug-query'

export default class ProductHandler {
  config: any

  constructor(config: any) {
    this.config = config
  }

  getAllFilteredProducts = async (variables: any) => {
    const result = await this.config.fetch(getAllProductsQuery, { variables })

    return this.normalizeAllProducts(
      result?.data?.getProductListing?.data ?? []
    )
  }

  getAllProducts = async () => {
    const result = await this.config.fetch(getAllProductsQuery)

    return this.normalizeAllProducts(
      result?.data?.getProductListing?.data ?? []
    )
  }

  getProductById = async (id: string) => {
    const result = await this.config.fetch(getProductById, {
      variables: { id },
    })

    return this.normalizeProduct(result?.data?.product)
  }

  getProductBySlug = async (slug: any) => {
    const result = await this.config.fetch(getProductBySlug, {
      variables: { slug },
    })

    return this.normalizeProduct(result?.data?.productBySlug?.product)
  }

  normalizeProduct = (product: any) => {
    return product ? normalizeProduct(product, this.config) : null
  }

  normalizeAllProducts = (products: []) => {
    return products.map((item: any) => normalizeProduct(item, this.config))
  }
}
