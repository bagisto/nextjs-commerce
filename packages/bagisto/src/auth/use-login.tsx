import { useCallback } from 'react'
import { MutationHook } from '@vercel/commerce/utils/types'
import useLogin, { UseLogin } from '@vercel/commerce/auth/use-login'
import { CommerceError, ValidationError } from '@vercel/commerce/utils/errors'
import useCustomer from '../customer/use-customer'

export default useLogin as UseLogin<typeof handler>

export const handler: MutationHook<any> = {
  fetchOptions: {
    query: `
        mutation customerLogin {
          customerLogin(input: {
              email: "devansh@example.com"
              password: "admin123"
          }) {
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
    `,
  },

  async fetcher({ input: { email, password }, options, fetch }) {
    if (!(email && password)) {
      throw new CommerceError({
        message: 'An email and password are required to login',
      })
    }

    const { login } = await fetch({
      ...options,
    })

    return null
  },

  useHook:
    ({ fetch }) =>
    () => {
      const { mutate } = useCustomer()

      return useCallback(
        async function login(input) {
          const data = await fetch({ input })
          await mutate()
          return data
        },
        [fetch, mutate]
      )
    },
}
