import { OperationContext } from '@vercel/commerce/api/operations'
import { Category } from '@vercel/commerce/types/site'
import { BagistoConfig } from '../index'
import { normalizeCategories } from '../lib/normalize'
import { getCategoriesQuery } from '../queries/get-categories-query'

export type GetSiteInfoResult<
  T extends { categories: any[]; brands: any[] } = {
    categories: Category[]
    brands: any[]
  }
> = T

export default function getSiteInfoOperation({
  commerce,
}: OperationContext<any>) {
  async function getSiteInfo({
    query,
    variables,
    config: cfg,
  }: {
    query?: string
    variables?: any
    config?: Partial<BagistoConfig>
    preview?: boolean
  } = {}): Promise<GetSiteInfoResult> {
    const bagistoConfig = commerce.getConfig(cfg)

    const response = await bagistoConfig.fetch(getCategoriesQuery)

    const categories = normalizeCategories(response?.data?.homeCategories ?? [])

    return Promise.resolve({
      categories: [
        {
          id: 'new-products',
          name: 'New Arrivals',
          slug: 'new-arrivals',
          path: '/new-arrivals',
        },
        {
          id: 'featured-products',
          name: 'Featured',
          slug: 'featured',
          path: '/featured',
        },
        ...categories,
      ],
      brands: [],
    })
  }

  return getSiteInfo
}
