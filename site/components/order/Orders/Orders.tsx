import { useEffect } from 'react'
import { Bag } from '@components/icons'

import useOrders from '@framework/order/use-orders'

const Orders = () => {
  const { data: orders } = useOrders()

  useEffect(() => {
    console.log(orders)
  })

  return (
    <div className="flex-1 flex flex-col">
      <table className="table-auto text-center">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>23</td>
            <td>2022-03-17 16:10:32 </td>
            <td>₹160.00</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td>22</td>
            <td>2022-03-17 16:10:32</td>
            <td>₹160.00</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </div>

    // <div className="flex-1 p-24 flex flex-col justify-center items-center ">
    //   <span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
    //     <Bag className="absolute" />
    //   </span>
    //   <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
    //     No orders found
    //   </h2>
    //   <p className="text-accent-6 px-10 text-center pt-2">
    //     Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
    //   </p>
    // </div>
  )
}

export default Orders
