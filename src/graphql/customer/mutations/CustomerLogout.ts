import { gql } from "@apollo/client";

export const CUSTOMER_LOGOUT = gql`
  mutation createLogout {
createLogout(input: {}) {
logout {
success
message
}
}
}
`;
