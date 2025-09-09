export const UpdateAddressMutation = /* GraphQL */ `
  mutation UpdateAddress($id: ID!, $input: AddressInput!) {
    updateAddress(id: $id, input: $input) {
      success
      message
    }
  }
`;
