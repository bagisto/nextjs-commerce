import { normalizeProduct } from '../../lib/normalize'
import { getAllProductsQuery } from '../../queries/get-all-products-query'
import { getFeaturedProductsQuery } from '../../queries/get-featured-products-query'
import { getNewProductsQuery } from '../../queries/get-new-products-query'

export default class ProductHandler {
  config: any

  constructor(config: any) {
    this.config = config
  }

  getAllProducts = async () => {
    const result = await this.config.fetch(getAllProductsQuery)

    return this.normalizeAllProducts(
      result?.data?.getProductListing?.data ?? []
    )
  }

  getNewProducts = async () => {
    const result = await this.config.fetch(getNewProductsQuery)

    return this.normalizeAllProducts(result?.data?.newProducts ?? [])
  }

  getFeaturedProducts = async () => {
    const result = await this.config.fetch(getFeaturedProductsQuery)

    return this.normalizeAllProducts(result?.data?.featuredProducts ?? [])
  }

  getAllProductsByCategory = async (category: string = 'all') => {
    switch (category) {
      case 'featured-products':
        return await this.getFeaturedProducts()

      case 'new-products':
        return await this.getNewProducts()

      default:
        return await this.getAllProducts()
    }
  }

  normalizeAllProducts = (products: []) => {
    return products.map((item: any) => normalizeProduct(item, this.config))
  }
}
