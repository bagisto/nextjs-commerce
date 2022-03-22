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

const Order = ({ order }: any) => {
  return (
    <Container>
      <Text variant="pageHeading">Order #{order.id}</Text>

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
