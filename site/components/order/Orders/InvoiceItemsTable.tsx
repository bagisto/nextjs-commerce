import { getFormattedPrice } from '@lib/price-helper'

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

export default InvoiceItemsTable
