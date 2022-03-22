import { useState } from 'react'
import { Bag } from '@components/icons'
import { Container, Text } from '@components/ui'
import { getFormattedPrice } from '@lib/price-helper'

const OrderItemsTable = ({ orderItems, currencyCode }: any) => {
  return (
    <table className="min-w-full">
      <thead className="border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            SKU
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Name
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Price
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Item Status
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Sub Total
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Tax Percent
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Tax Amount
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Grand Total
          </th>
        </tr>
      </thead>
      <tbody>
        {orderItems.map((orderItem: any) => {
          return (
            <tr key={orderItem.id} className="border-b">
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {orderItem.sku}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {orderItem.name}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(orderItem.price, currencyCode)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {`Ordered (${orderItem.qtyOrdered})`}{' '}
                {orderItem.qtyInvoiced
                  ? `Invoiced (${orderItem.qtyInvoiced})`
                  : ''}{' '}
                {orderItem.qtyShipped
                  ? `Shipped (${orderItem.qtyShipped})`
                  : ''}{' '}
                {orderItem.qtyRefunded
                  ? `Refunded (${orderItem.qtyRefunded})`
                  : ''}{' '}
                {orderItem.qtyCanceled
                  ? `Cancelled (${orderItem.qtyCanceled})`
                  : ''}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(orderItem.total, currencyCode)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {orderItem.taxPercent}%
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(orderItem.taxAmount, currencyCode)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(
                  orderItem.total +
                    orderItem.taxAmount -
                    orderItem.discountAmount,
                  currencyCode
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const InvoiceItemsTable = ({ invoiceItems, currencyCode }: any) => {
  return (
    <table className="min-w-full">
      <thead className="border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            SKU
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Name
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Price
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Sub Total
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Tax Amount
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Grand Total
          </th>
        </tr>
      </thead>
      <tbody>
        {invoiceItems.map((invoiceItem: any) => {
          return (
            <tr key={invoiceItem.id} className="border-b">
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {invoiceItem.sku}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {invoiceItem.name}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(invoiceItem.price, currencyCode)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(invoiceItem.total, currencyCode)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(invoiceItem.taxAmount, currencyCode)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(
                  invoiceItem.total +
                    invoiceItem.taxAmount -
                    invoiceItem.discountAmount,
                  currencyCode
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const ShipmentItemsTable = ({ shipmentItems, currencyCode }: any) => {
  return (
    <table className="min-w-full">
      <thead className="border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            SKU
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Name
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Qty
          </th>
        </tr>
      </thead>
      <tbody>
        {shipmentItems.map((shipmentItem: any) => {
          return (
            <tr key={shipmentItem.id} className="border-b">
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {shipmentItem.sku}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {shipmentItem.name}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {shipmentItem.qty}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const RefundItemsTable = ({ refundItems, currencyCode }: any) => {
  return (
    <table className="min-w-full">
      <thead className="border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            SKU
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Name
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Price
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Qty
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Sub Total
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Tax Amount
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Grand Total
          </th>
        </tr>
      </thead>
      <tbody>
        {refundItems.map((refundItem: any) => {
          return (
            <tr key={refundItem.id} className="border-b">
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {refundItem.sku}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {refundItem.name}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(refundItem.price, currencyCode)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {refundItem.qty}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(refundItem.total, currencyCode)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(refundItem.taxAmount, currencyCode)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {getFormattedPrice(
                  refundItem.total +
                    refundItem.taxAmount -
                    refundItem.discountAmount,
                  currencyCode
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const OrderAddress = ({ address }: any) => {
  return (
    <span>
      {address.company ? `${address.company} <br />` : ''}
      {address.firstName} {address.lastName} <br />
      {address.address1} <br />
      {address.city} <br />
      {address.state} {address.postcode} <br />
      {address.country} <br />
    </span>
  )
}

const Information = ({ order }: any) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
      <div className="grid grid-cols-1">
        <Text variant="sectionHeading">Products Ordered</Text>
        <OrderItemsTable
          orderItems={order.items}
          currencyCode={order.orderCurrencyCode}
        ></OrderItemsTable>
      </div>

      <div className="grid grid-cols-1 place-items-end mt-5">
        <div className="w-1/3">
          <ul className="pb-2">
            <li className="flex justify-between py-1">
              <span className="font-semibold">Subtotal</span>
              <span>
                {getFormattedPrice(order.subTotal, order.orderCurrencyCode)}
              </span>
            </li>
            <li className="flex justify-between py-1">
              <span className="font-semibold">Shipping And Handling</span>
              <span>
                {getFormattedPrice(
                  order.shippingAmount,
                  order.orderCurrencyCode
                )}
              </span>
            </li>
            <li className="flex justify-between py-1">
              <span className="font-semibold">Tax</span>
              <span>
                {getFormattedPrice(order.taxAmount, order.orderCurrencyCode)}
              </span>
            </li>
            <hr />
            <li className="flex justify-between py-1">
              <span className="font-semibold">Grand Total</span>
              <span>
                {getFormattedPrice(order.grandTotal, order.orderCurrencyCode)}
              </span>
            </li>
            <li className="flex justify-between py-1">
              <span className="font-semibold">Total Paid</span>
              <span>
                {getFormattedPrice(
                  order.grandTotalInvoiced,
                  order.orderCurrencyCode
                )}
              </span>
            </li>
            <li className="flex justify-between py-1">
              <span className="font-semibold">Total Refunded</span>
              <span>
                {getFormattedPrice(
                  order.grandTotalRefunded,
                  order.orderCurrencyCode
                )}
              </span>
            </li>
            <li className="flex justify-between py-1">
              <span className="font-semibold">Total Due</span>
              <span>
                {getFormattedPrice(
                  order.grandTotal - order.grandTotalInvoiced,
                  order.orderCurrencyCode
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const Invoices = ({ invoices }: any) => {
  if (!(invoices.length > 0)) {
    return (
      <div className="flex-1 p-24 flex flex-col justify-center items-center ">
        <span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
          <Bag className="absolute" />
        </span>
        <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
          No invoices found
        </h2>
      </div>
    )
  }

  return invoices.map((invoice: any) => {
    return (
      <div
        key={invoice.id}
        className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800"
      >
        <div className="grid grid-cols-1">
          <Text variant="sectionHeading">Invoice #{invoice.id}</Text>
          <InvoiceItemsTable
            invoiceItems={invoice.items}
            currencyCode={invoice.orderCurrencyCode}
          ></InvoiceItemsTable>
        </div>

        <div className="grid grid-cols-1 place-items-end mt-5">
          <div className="w-1/3">
            <ul className="pb-2">
              <li className="flex justify-between py-1">
                <span className="font-semibold">Subtotal</span>
                <span>
                  {getFormattedPrice(
                    invoice.subTotal,
                    invoice.orderCurrencyCode
                  )}
                </span>
              </li>
              <li className="flex justify-between py-1">
                <span className="font-semibold">Shipping And Handling</span>
                <span>
                  {getFormattedPrice(
                    invoice.shippingAmount,
                    invoice.orderCurrencyCode
                  )}
                </span>
              </li>
              <li className="flex justify-between py-1">
                <span className="font-semibold">Tax</span>
                <span>
                  {getFormattedPrice(
                    invoice.taxAmount,
                    invoice.orderCurrencyCode
                  )}
                </span>
              </li>
              <hr />
              <li className="flex justify-between py-1">
                <span className="font-semibold">Grand Total</span>
                <span>
                  {getFormattedPrice(
                    invoice.grandTotal,
                    invoice.orderCurrencyCode
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  })
}

const Shipments = ({ shipments }: any) => {
  if (!(shipments.length > 0)) {
    return (
      <div className="flex-1 p-24 flex flex-col justify-center items-center ">
        <span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
          <Bag className="absolute" />
        </span>
        <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
          No shipments found
        </h2>
      </div>
    )
  }

  return shipments.map((shipment: any) => {
    return (
      <div
        key={shipment.id}
        className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800"
      >
        <div className="grid grid-cols-1">
          <Text variant="sectionHeading">Shipment #{shipment.id}</Text>
          <ShipmentItemsTable
            shipmentItems={shipment.items}
            currencyCode={shipment.orderCurrencyCode}
          ></ShipmentItemsTable>
        </div>
      </div>
    )
  })
}

const Refunds = ({ refunds }: any) => {
  if (!(refunds.length > 0)) {
    return (
      <div className="flex-1 p-24 flex flex-col justify-center items-center ">
        <span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
          <Bag className="absolute" />
        </span>
        <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
          No refunds found
        </h2>
      </div>
    )
  }

  return refunds.map((refund: any) => {
    return (
      <div
        key={refund.id}
        className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800"
      >
        <div className="grid grid-cols-1">
          <Text variant="sectionHeading">Refund #{refund.id}</Text>
          <RefundItemsTable
            refundItems={refund.items}
            currencyCode={refund.orderCurrencyCode}
          ></RefundItemsTable>
        </div>

        <div className="grid grid-cols-1 place-items-end mt-5">
          <div className="w-1/3">
            <ul className="pb-2">
              <li className="flex justify-between py-1">
                <span className="font-semibold">Subtotal</span>
                <span>
                  {getFormattedPrice(refund.subTotal, refund.orderCurrencyCode)}
                </span>
              </li>
              <li className="flex justify-between py-1">
                <span className="font-semibold">Adjustment Refund</span>
                <span>
                  {getFormattedPrice(
                    refund.adjustmentRefund,
                    refund.orderCurrencyCode
                  )}
                </span>
              </li>
              <li className="flex justify-between py-1">
                <span className="font-semibold">Adjustment Fee</span>
                <span>
                  {getFormattedPrice(
                    refund.adjustmentFee,
                    refund.orderCurrencyCode
                  )}
                </span>
              </li>
              <hr />
              <li className="flex justify-between py-1">
                <span className="font-semibold">Grand Total</span>
                <span>
                  {getFormattedPrice(
                    refund.grandTotal,
                    refund.orderCurrencyCode
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  })
}

const Order = ({ order }: any) => {
  const [view, setView] = useState('INFO_VIEW')

  function changeView(viewName: string) {
    setView(viewName)
  }

  return (
    <Container>
      <Text variant="pageHeading">Order #{order.id}</Text>

      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button
              className="inline-block p-4 rounded-t-lg border-b-2 text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500"
              onClick={() => changeView('INFO_VIEW')}
            >
              Information
            </button>
          </li>
          <li className="mr-2">
            <button
              className="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700"
              onClick={() => changeView('INVOICES_VIEW')}
            >
              Invoices
            </button>
          </li>
          <li className="mr-2">
            <button
              className="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700"
              onClick={() => changeView('SHIPMENTS_VIEW')}
            >
              Shipments
            </button>
          </li>
          <li>
            <button
              className="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700"
              onClick={() => changeView('REFUNDS_VIEW')}
            >
              Refunds
            </button>
          </li>
        </ul>
      </div>

      <div>
        {view === 'INFO_VIEW' ? (
          <Information order={order}></Information>
        ) : view === 'INVOICES_VIEW' ? (
          <Invoices invoices={order.invoices}></Invoices>
        ) : view === 'SHIPMENTS_VIEW' ? (
          <Shipments shipments={order.shipments}></Shipments>
        ) : view === 'REFUNDS_VIEW' ? (
          <Refunds refunds={order.refunds}></Refunds>
        ) : (
          <Information order={order}></Information>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
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
      </div>
    </Container>
  )
}

export default Order
