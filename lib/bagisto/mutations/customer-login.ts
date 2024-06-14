export const CustomerLogin = /* GraphQL */ `
  mutation CustomerLogin($input: LoginInput!) {
    customerLogin(input: $input) {
      status
      success
      accessToken
      tokenType
      expiresIn
      customer {
        id
        firstName
        lastName
        name
        gender
        dateOfBirth
        email
        phone
        notes
        image
        imageUrl
        password
        apiToken
        customerGroupId
        isVerified
        isSuspended
        token
        status
        createdAt
        updatedAt
        success
      }
    }
  }
`;
