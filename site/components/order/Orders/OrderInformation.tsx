import { Text } from '@components/ui'
import { getFormattedPrice } from '@lib/price-helper'

import OrderItemsTable from './OrderItemsTable'

const OrderInformation = ({ order }: any) => {
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

export default OrderInformation
