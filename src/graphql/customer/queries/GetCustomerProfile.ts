import { gql } from "@apollo/client";

export const GET_CUSTOMER_PROFILE = gql`
  query getCustomerProfile {
    readCustomerProfile {
      id
      firstName
      lastName
      email
      dateOfBirth
      gender
      phone
      status
      subscribedToNewsLetter
      isVerified
      image
    }
  }
`;
