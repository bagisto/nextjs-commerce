export const CustomerRegister = /* GraphQL */ `
  mutation CustomerSignUp($input: SignUpInput!) {
    customerSignUp(input: $input) {
      success
      message
      accessToken
      tokenType
      expiresIn
    }
  }
`;
