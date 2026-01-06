import { gql } from "@apollo/client";

export const FORGET_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    createForgotPassword(input: { email: $email }) {
      forgotPassword {
        success
        message
      }
    }
  }
`;
