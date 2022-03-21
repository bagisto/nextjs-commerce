import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'

import { getFormattedPrice } from '@lib/price-helper'

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
  return (
    <Container>
      <Text variant="pageHeading">Order #{order.id}</Text>
      <div className="grid lg:grid-cols-12">
        <div className="lg:col-span-8 pr-4">
          <div>
            <Text variant="sectionHeading">Total Amount</Text>
            <span>
              {getFormattedPrice(order.grandTotal, order.orderCurrencyCode)}
            </span>
          </div>
          <div className="mt-5">
            <Text variant="sectionHeading">Shipping Method</Text>
            <span>{order.shippingTitle}</span>
          </div>
          <div className="mt-5">
            <Text variant="sectionHeading">Payment Method</Text>
            <span>{order.payment.methodTitle}</span>
          </div>
        </div>
      </div>
    </Container>
  )
}

Order.Layout = Layout
