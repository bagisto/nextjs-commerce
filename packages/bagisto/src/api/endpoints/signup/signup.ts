import { FetcherError } from '@vercel/commerce/utils/errors'
import { registerUserMutation } from '../../mutations/register-user-mutation'

import type { SignupEndpoint } from '.'

const invalidCredentials = /invalid credentials/i

const signup: SignupEndpoint['handlers']['signup'] = async ({
  req,
  res,
  body: { email, password, firstName, lastName },
  config,
  commerce,
}) => {
  if (!(email && password)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }

  try {
    await config.fetch(registerUserMutation, {
      variables: {
        firstName,
        lastName,
        email,
        password,
        passwordConfirmation: password,
      },
    })
  } catch (error) {
    // Check if the email and password didn't match an existing account.
    if (
      error instanceof FetcherError &&
      invalidCredentials.test(error.message)
    ) {
      return res.status(401).json({
        data: null,
        errors: [
          {
            message:
              'Cannot find an account that matches the provided credentials',
            code: 'invalid_credentials',
          },
        ],
      })
    }

    throw error
  }

  await commerce.login({ variables: { email, password }, config, res })

  res.status(200).json({ data: null })
}

export default signup
