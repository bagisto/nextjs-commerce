export const CREATE_CUSTOMER_ADDRESS = `
  mutation createCustomerAddress($input: createAddUpdateCustomerAddressInput!) {
    createAddUpdateCustomerAddress(input: $input) {
      addUpdateCustomerAddress {
        id
        _id
        firstName
        lastName
        address1
        address2
        city
        state
        country
        postcode
        phone
        email
        defaultAddress
      }
    }
  }
`;
