export const CustomerLogin = /* GraphQL */ `
  mutation CustomerLogin($input: LoginInput!) {
    customerLogin(input: $input) {
      success
      message
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
      }
    }
  }
`;
