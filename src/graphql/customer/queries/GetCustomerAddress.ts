export const GET_CUSTOMER_ADDRESS = `
  query getCustomerAddress($id: ID!) {
    customerAddress(id: $id) {
      id
      _id
      firstName
      lastName
      companyName
      vatId
      email
      phone
      address
      city
      state
      country
      postcode
      defaultAddress
      useForShipping
      addressType
      createdAt
      updatedAt
    }
  }
`;
