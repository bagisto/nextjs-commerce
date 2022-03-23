import { getFormattedPrice } from '@lib/price-helper'

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

export default RefundItemsTable
