'use client';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import InputText from 'components/checkout/cart/input';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { createUser } from '../lib/action';
import { LoadingButton } from './loading-button';
const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: ''
};
export default function RegistrationForm() {
  const [status, formAction] = useFormState(createUser, initialState);
  return (
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 dark:bg-black">
        {status?.errors?.apiError && (
          <div className="text-md flex items-center gap-1 text-danger">
            {' '}
            <ExclamationCircleIcon className="h-6 w-6" /> {status?.errors?.apiError}
          </div>
        )}
        <div className="pb-6 sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="py-1 text-center text-2xl font-bold">Become User</h2>
          <p className="mt-2 text-center text-sm">
            If you are new to our store, we glad to have you as member.
          </p>
        </div>

        <form className="space-y-4" action={formAction}>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3">
              <div className="mt-1">
                <InputText
                  className=""
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  defaultValue={status?.firstName}
                  errorMsg={status?.errors?.firstName}
                />
              </div>
            </div>
            <div className="col-span-3">
              <div className="mt-1">
                <InputText
                  className=""
                  name="lastName"
                  placeholder="Enter your last name"
                  label="Last Name"
                  defaultValue={status?.lastName}
                />
              </div>
            </div>
            <div className="col-span-6">
              <div className="mt-1">
                <InputText
                  className=""
                  name="email"
                  label="Email"
                  placeholder="Enter your email address"
                  defaultValue={status?.email}
                  errorMsg={status?.errors?.email}
                />
              </div>
            </div>
            <div className="col-span-6">
              <div className="mt-1">
                <InputText
                  className=""
                  name="password"
                  typeName="password"
                  label="Password"
                  placeholder="Enter your password"
                  defaultValue={status?.password}
                  errorMsg={status?.errors?.password}
                />
              </div>
            </div>
            <div className="col-span-6">
              <div className="mt-1">
                <InputText
                  className=""
                  name="passwordConfirmation"
                  typeName="password"
                  label="Confirm Password"
                  placeholder="Enter your confirm password"
                  defaultValue={status?.passwordConfirmation}
                  errorMsg={status?.errors?.passwordConfirmation || status?.errors?.confirm}
                />
              </div>
            </div>
          </div>
          <div>
            <LoadingButton buttonName="Sign Up" />
          </div>
        </form>
        <div className="mt-6">
          <div className="text-sm">
            <span className="px-2">
              Already have an account ?{' '}
              <Link href="/customer/login" className="text-blue-600">
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
