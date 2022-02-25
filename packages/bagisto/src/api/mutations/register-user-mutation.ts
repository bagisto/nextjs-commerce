export const registerUserMutation = /* GraphQL */ `
  mutation customerRegister(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    customerRegister(
      input: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        passwordConfirmation: $password
      }
    ) {
      status
      success
    }
  }
`
