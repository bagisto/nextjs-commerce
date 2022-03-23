const OrderAddress = ({ address }: any) => {
  return (
    <span>
      {address.company ? `${address.company} <br />` : ''}
      {address.firstName} {address.lastName} <br />
      {address.address1} <br />
      {address.city} <br />
      {address.state} {address.postcode} <br />
      {address.country} <br />
    </span>
  )
}

export default OrderAddress
