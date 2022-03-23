import { useEffect, useState } from 'react'
import { Bag } from '@components/icons'
import { Container, Text } from '@components/ui'

import useOrders from '@framework/order/use-orders'

import OrderAddress from './OrderAddress'
import OrderInformation from './OrderInformation'
import Invoices from './Invoices'
import Shipments from './Shipments'
import Refunds from './Refunds'

const Order = ({ orderId }: any) => {
  const [view, setView] = useState('INFO_VIEW')

  const { data: orders = [] } = useOrders({ orderId })

  if (!(orders.length > 0)) {
    return (
      <div className="flex-1 p-24 flex flex-col justify-center items-center ">
        <span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
          <Bag className="absolute" />
        </span>
        <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
          Please Wait!
        </h2>
      </div>
    )
  }

  const order = orders[0]

  const Tabs = () => {
    const selectedClass =
      'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-600 dark:text-gray-600 border-gray-600 dark:border-gray-600'

    const normalClass =
      'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700'

    return (
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
        <li className="mr-2">
          <button
            className={view === 'INFO_VIEW' ? selectedClass : normalClass}
            onClick={() => setView('INFO_VIEW')}
          >
            Information
          </button>
        </li>
        <li className="mr-2">
          <button
            className={view === 'INVOICES_VIEW' ? selectedClass : normalClass}
            onClick={() => setView('INVOICES_VIEW')}
          >
            Invoices
          </button>
        </li>
        <li className="mr-2">
          <button
            className={view === 'SHIPMENTS_VIEW' ? selectedClass : normalClass}
            onClick={() => setView('SHIPMENTS_VIEW')}
          >
            Shipments
          </button>
        </li>
        <li>
          <button
            className={view === 'REFUNDS_VIEW' ? selectedClass : normalClass}
            onClick={() => setView('REFUNDS_VIEW')}
          >
            Refunds
          </button>
        </li>
      </ul>
    )
  }

  const TabView = () => {
    switch (view) {
      case 'INVOICES_VIEW':
        return <Invoices invoices={order.invoices}></Invoices>
      case 'SHIPMENTS_VIEW':
        return <Shipments shipments={order.shipments}></Shipments>
      case 'REFUNDS_VIEW':
        return <Refunds refunds={order.refunds}></Refunds>
      default:
        return <OrderInformation order={order}></OrderInformation>
    }
  }

  const TabFooter = () => {
    return (
      <>
        <div className="mt-5">
          <Text variant="sectionHeading">Shipping Address</Text>
          <OrderAddress address={order.shippingAddress}></OrderAddress>
        </div>

        <div className="mt-5">
          <Text variant="sectionHeading">Billing Address</Text>
          <OrderAddress address={order.billingAddress}></OrderAddress>
        </div>

        <div className="mt-5">
          <Text variant="sectionHeading">Shipping Method</Text>
          <span>{order.shippingTitle}</span>
        </div>

        <div className="mt-5">
          <Text variant="sectionHeading">Payment Method</Text>
          <span>{order.payment.methodTitle}</span>
        </div>
      </>
    )
  }

  return (
    <Container>
      <Text variant="pageHeading">Order #{order.id}</Text>

      <div className="mb-4 border-b border-gray-200">
        <Tabs></Tabs>
      </div>

      <div className="mb-4 border-b border-gray-200">
        <TabView></TabView>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-4">
        <TabFooter></TabFooter>
      </div>
    </Container>
  )
}

export default Order
