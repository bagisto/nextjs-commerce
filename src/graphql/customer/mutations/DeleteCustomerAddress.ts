export const DELETE_CUSTOMER_ADDRESS = `
  mutation deleteCustomerAddress($input: createDeleteCustomerAddressInput!) {
    createDeleteCustomerAddress(input: $input) {
      deleteCustomerAddress {
        id
      }
    }
  }
`;
