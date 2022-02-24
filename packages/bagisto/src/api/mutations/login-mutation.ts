export const loginMutation = /* GraphQL */ `
  mutation customerLogin ($email: String!, $password: String!) {
    customerLogin(
      input: { email: $email, password: $password }
    ) {
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
        password
        apiToken
        customerGroupId
        subscribedToNewsLetter
        isVerified
        token
        notes
        status
        createdAt
        updatedAt
      }
    }
  }
`
