import { gql } from "@apollo/client";

export const CUSTOMER_LOGIN = gql`
  mutation loginCustomer($input: createLoginInput!) {
    createLogin(input: $input) {
      login {
        apiToken
        token
        success
        message
      }
    }
  }
`;
