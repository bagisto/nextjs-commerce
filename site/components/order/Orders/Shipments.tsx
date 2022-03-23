import { Bag } from '@components/icons'
import { Text } from '@components/ui'

import ShipmentItemsTable from './ShipmentItemsTable'

const Shipments = ({ shipments }: any) => {
  if (!(shipments.length > 0)) {
    return (
      <div className="flex-1 p-24 flex flex-col justify-center items-center ">
        <span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
          <Bag className="absolute" />
        </span>
        <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
          No shipments found
        </h2>
      </div>
    )
  }

  return shipments.map((shipment: any) => {
    return (
      <div
        key={shipment.id}
        className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800"
      >
        <div className="grid grid-cols-1">
          <Text variant="sectionHeading">Shipment #{shipment.id}</Text>
          <ShipmentItemsTable
            shipmentItems={shipment.items}
            currencyCode={shipment.orderCurrencyCode}
          ></ShipmentItemsTable>
        </div>
      </div>
    )
  })
}

export default Shipments
