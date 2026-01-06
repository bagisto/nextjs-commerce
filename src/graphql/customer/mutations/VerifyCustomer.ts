import { gql } from "@apollo/client";

export const VERIFY_CUSTOMER = gql`
  mutation verifyCustomer($token: String!, $clientMutationId: String) {
    createVerifyToken(
      input: {
        token: $token
        clientMutationId: $clientMutationId
      }
    ) {
      verifyToken {
        id
        firstName
        lastName
        email
        isValid
        message
      }
    }
  }
`;
