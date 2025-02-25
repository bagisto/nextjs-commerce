'use client';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import InputText from 'components/checkout/cart/input';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { z } from 'zod';
import { LoadingButton } from './loading-button';

const loginDefaultValue = {
  username: '',
  password: ''
};
const loginSchema = z.object({
  username: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.'
    })
    .trim()
});

export function LoginForm() {
  const router = useRouter();
  async function authenticate(prevState: any, formData: FormData) {
    try {
      const data = {
        username: formData.get('username'),
        password: formData.get('password')
      };
      const validatedFields = loginSchema.safeParse(data);
      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors
        };
      }

      return await signIn('credentials', {
        redirect: false,
        ...data,
        callbackUrl: '/'
      })
        .then((result) => {
          if (result?.ok) {
            router.push('/');
          }
          return {
            errors: {
              apiError: result?.error
            }
          };
        })
        .catch((errr) => {
          console.log(errr);
        });
    } catch (error) {
      console.error('Something went wrong :', error);
    }
  }
  const [status, dispatch] = useFormState(authenticate, loginDefaultValue);

  return (
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 dark:bg-black">
        {status?.errors?.apiError && (
          <div className="text-md flex items-center justify-center gap-1 text-danger">
            <ExclamationCircleIcon className="h-5 w-5" /> {status?.errors?.apiError}
          </div>
        )}
        <div className="pb-6 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="py-1 text-center text-2xl font-bold">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm">
            If you have an account, sign in with your email address.
          </p>
        </div>
        <form className="space-y-4" action={dispatch}>
          <div>
            <InputText
              className=""
              name="username"
              label="Email"
              placeholder="Enter your email address"
              typeName="text"
              defaultValue={status?.username}
              errorMsg={status?.errors?.username}
            />
          </div>
          <div>
            <InputText
              className=""
              name="password"
              label="Password"
              placeholder="Enter your password"
              typeName="password"
              defaultValue={status?.password}
              errorMsg={status?.errors?.password}
            />
          </div>
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link
                href="/customer/forget-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <LoadingButton buttonName="Sign In" />
          </div>
        </form>
        <div className="mt-6">
          <div className="text-sm">
            <span className="px-2">
              New customer?{' '}
              <Link
                href="/customer/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {' '}
                Create your account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
