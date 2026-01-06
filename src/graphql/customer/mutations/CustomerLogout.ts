import { gql } from "@apollo/client";

export const CUSTOMER_LOGOUT = gql`
  mutation Logout($input: createLogoutInput!) {
    createLogout(input: $input) {
      logout {
        success
        message
      }
    }
  }
`;
