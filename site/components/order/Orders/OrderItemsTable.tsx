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

export default OrderItemsTable

