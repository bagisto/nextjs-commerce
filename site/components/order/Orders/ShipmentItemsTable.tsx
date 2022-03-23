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

export default ShipmentItemsTable
