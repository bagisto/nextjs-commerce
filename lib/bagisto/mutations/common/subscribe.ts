export const userSubsCribeMutation = /* GraphQL */ `
  mutation Subscribe($email: String!) {
    subscribe(email: $email) {
      success
      message
    }
  }
`;
