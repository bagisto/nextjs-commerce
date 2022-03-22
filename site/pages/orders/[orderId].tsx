import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'

import OrderComponent from '@components/order/Orders/Order'

import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext<{ orderId: string }>) {
  const config = { locale, locales }

  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const orderPromise = commerce.getOrder({
    config,
    preview,
    variables: { input: { id: parseInt(params!.orderId) } },
  })

  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise
  const { order } = await orderPromise

  return {
    props: { pages, categories, order },
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default function Order({ order }: any) {
  return <OrderComponent order={order}></OrderComponent>
}

Order.Layout = Layout
