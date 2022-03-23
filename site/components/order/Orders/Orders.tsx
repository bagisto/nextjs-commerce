import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bag, Eye } from '@components/icons'
import { Button } from '@components/ui'
import useOrders from '@framework/order/use-orders'
import { getFormattedPrice } from '@lib/price-helper'

const Orders = () => {
  const [isEmpty, setIsEmpty] = useState(false)

  const [page, setPage] = useState(1)

  const [orders, setOrders] = useState<any>([])

  const { mutate } = useOrders({ page })

  useEffect(() => nextOrders(), [])

  async function loadOrders() {
    let nextOrders = await mutate()

    if (!(nextOrders.length > 0)) {
      setIsEmpty(true)
      return
    }

    let updatedOrders = [...orders, ...nextOrders]

    setOrders(updatedOrders)
  }

  function nextOrders() {
    setPage(page + 1)

    loadOrders()
  }

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
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => {
                  return (
                    <tr key={order.id} className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {order.date}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {getFormattedPrice(
                          order.total,
                          order.orderCurrencyCode
                        )}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {order.status === 'pending' ? (
                          <span
                            className="text-xs font-semibold mr-2 p-3 rounded"
                            style={{
                              backgroundColor: 'yellow',
                              color: 'black',
                            }}
                          >
                            Pending
                          </span>
                        ) : order.status === 'processing' ? (
                          <span
                            className="text-xs font-semibold mr-2 p-3 rounded"
                            style={{
                              backgroundColor: 'green',
                              color: 'white',
                            }}
                          >
                            Processing
                          </span>
                        ) : order.status === 'completed' ? (
                          <span
                            className="text-xs font-semibold mr-2 p-3 rounded"
                            style={{
                              backgroundColor: 'green',
                              color: 'white',
                            }}
                          >
                            Completed
                          </span>
                        ) : order.status === 'cancelled' ? (
                          <span
                            className="text-xs font-semibold mr-2 p-3 rounded"
                            style={{ backgroundColor: 'red', color: 'white' }}
                          >
                            Cancelled
                          </span>
                        ) : (
                          <span
                            className="text-xs font-semibold mr-2 p-3 rounded"
                            style={{ backgroundColor: 'blue', color: 'white' }}
                          >
                            Closed
                          </span>
                        )}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
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
        </div>
      </div>

      {!isEmpty ? (
        <div
          className="overflow-x-auto sm:-mx-6 lg:-mx-8"
          style={{ margin: '0 auto' }}
        >
          <Button className="mx-5" onClick={() => nextOrders()}>
            Load More
          </Button>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Orders
