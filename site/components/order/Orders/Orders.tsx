import Link from 'next/link'
import { Bag, Eye } from '@components/icons'
import useOrders from '@framework/order/use-orders'
import { getFormattedPrice } from '@lib/price-helper'

const Orders = () => {
  const { data: orders = [] } = useOrders()

  if (!(orders.length > 0)) {
    return (
      <div className="flex-1 p-24 flex flex-col justify-center items-center ">
        <span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
          <Bag className="absolute" />
        </span>
        <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
          No orders found
        </h2>
        <p className="text-accent-6 px-10 text-center pt-2">
          Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <table className="table-auto text-center">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => {
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>
                  {getFormattedPrice(order.total, order.orderCurrencyCode)}
                </td>
                <td>
                  {order.status === 'pending' ? (
                    <span
                      className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                      style={{ backgroundColor: 'yellow', color: 'black' }}
                    >
                      Pending
                    </span>
                  ) : order.status === 'processing' ? (
                    <span
                      className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                      style={{ backgroundColor: 'green', color: 'white' }}
                    >
                      Processing
                    </span>
                  ) : order.status === 'completed' ? (
                    <span
                      className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                      style={{ backgroundColor: 'green', color: 'white' }}
                    >
                      Completed
                    </span>
                  ) : order.status === 'cancelled' ? (
                    <span
                      className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                      style={{ backgroundColor: 'red', color: 'white' }}
                    >
                      Cancelled
                    </span>
                  ) : (
                    <span
                      className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                      style={{ backgroundColor: 'blue', color: 'white' }}
                    >
                      Closed
                    </span>
                  )}
                </td>
                <td>
                  <Link href={`/orders/${order.id}`}>
                    <a>
                      <Eye></Eye>
                    </a>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Orders
