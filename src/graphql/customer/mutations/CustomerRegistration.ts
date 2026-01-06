import { gql } from "@apollo/client";

export const CUSTOMER_REGISTRATION = gql`
  mutation registerCustomer($input: createCustomerInput!) {
    createCustomer(input: $input) {
      customer {
        id
        _id
        firstName
        lastName
        email
        phone
        gender
        dateOfBirth
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
