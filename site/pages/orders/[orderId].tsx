import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { Layout } from '@components/common'
import commerce from '@lib/api/commerce'

import OrderComponent from '@components/order/Orders/Order'

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext<{ orderId: string }>) {
  const config = { locale, locales }

  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })

  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise

  return {
    props: { pages, categories, orderId: parseInt(params!.orderId) },
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default function Order({ orderId }: any) {
  return <OrderComponent orderId={orderId}></OrderComponent>
}

Order.Layout = Layout
