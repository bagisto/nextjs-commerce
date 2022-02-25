import { Product } from '@vercel/commerce/types/product'
import { ProductsEndpoint } from './'
import { normalizeProduct } from '../../lib/normalize'

const getProducts: ProductsEndpoint['handlers']['getProducts'] = async ({
  res,
  body: { search, categoryId, brandId, sort },
  config,
  commerce,
}) => {
  const responseData: Product[] = []

  const found = responseData.length > 0 ? true : false

  const products: Product[] = responseData.map((item: any) =>
    normalizeProduct(item, config)
  )

  res.status(200).json({ data: { products, found } })
}

export default getProducts
