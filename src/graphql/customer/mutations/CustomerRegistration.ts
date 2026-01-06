import { gql } from "@apollo/client";

export const CUSTOMER_REGISTRATION = gql`
  mutation registerCustomer($input: createCustomerInput!) {
    createCustomer(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
        status
        apiToken
        customerGroupId
        subscribedToNewsLetter
        isVerified
        isSuspended
        token
        rememberToken
        name
      }
    }
  }
`;
