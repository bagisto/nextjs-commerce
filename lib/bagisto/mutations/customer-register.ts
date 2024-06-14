export const CustomerRegister = /* GraphQL */ `
  mutation CustomerRegister($input: CreateRegisterInput!) {
    customerRegister(input: $input) {
      success
      accessToken
      tokenType
      expiresIn
    }
  }
`;
