import { Bag } from '@components/icons'
import { Text } from '@components/ui'
import { getFormattedPrice } from '@lib/price-helper'

import InvoiceItemsTable from './InvoiceItemsTable'

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

export default Invoices
