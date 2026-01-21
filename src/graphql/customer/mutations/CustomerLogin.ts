import { gql } from "@apollo/client";

export const CUSTOMER_LOGIN = gql`
  mutation loginCustomer($input: createCustomerLoginInput!) {
    createCustomerLogin(input: $input) {
     customerLogin {
            id
            apiToken
            token
            message
            success
        }
    }
  }
`;
