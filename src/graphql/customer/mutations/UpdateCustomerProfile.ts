import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER_PROFILE = gql`
  mutation updateCustomerProfile($input: createCustomerProfileUpdateInput!) {  
    createCustomerProfileUpdate(input: $input) {
      customerProfileUpdate {
        id
        firstName
        lastName
        email
        dateOfBirth
        gender
        phone
        image
      }
    }
  }
`;
