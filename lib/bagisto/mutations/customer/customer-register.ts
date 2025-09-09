export const CustomerRegister = /* GraphQL */ `
  mutation customerSignUp($input: SignUpInput!) {
    customerSignUp(input: $input) {
      success
      message
      accessToken
      tokenType
      expiresIn
    }
  }
`;
