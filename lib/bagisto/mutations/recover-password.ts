export const ForgetPassword = /* GraphQL */ `
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      success
      status
    }
  }
`;
