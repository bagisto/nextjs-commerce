'use client';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import InputText from 'components/checkout/cart/input';
import { isObject } from 'lib/type-guards';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { recoverPassword } from '../lib/action';
import { LoadingButton } from './loading-button';
const forgetDefaultValue = {
  email: ''
};
export function ForgetPasswordForm() {
  const [errorStatus, formAction] = useFormState(recoverPassword, forgetDefaultValue);
  return (
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 dark:bg-black">
        {isObject(errorStatus?.errors?.apiRes) && (
          <div
            className={`text-md flex items-start gap-1 pb-2 ${
              errorStatus?.errors?.apiRes?.status ? 'text-success' : 'text-danger'
            } `}
          >
            {errorStatus?.errors?.apiRes?.status ? (
              <CheckCircleIcon className="h-6 w-6" />
            ) : (
              <ExclamationCircleIcon className="h-4 w-4" />
            )}
            {errorStatus?.errors?.apiRes?.msg?.split(':')?.[1]}
          </div>
        )}
        <div className="pb-2 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="py-1 text-center text-2xl font-bold">Recover Password</h2>
          <p className="mt-2 text-center text-sm">
            If you forgot your password, recover it by entering your email address.
          </p>
        </div>
        <form className="space-y-4" action={formAction} method="POST">
          <div className="mt-1">
            <InputText
              className=""
              name="email"
              typeName="text"
              label="Email "
              placeholder="Enter your email address"
              errorMsg={errorStatus?.errors?.email}
            />
          </div>

          <div>
            <LoadingButton buttonName="Reset password" />
          </div>
        </form>

        <div className="mt-6">
          <div className="text-sm">
            <span className="px-2">
              Back to sign In ?{' '}
              <Link href="/customer/login" className="text-blue-600">
                {' '}
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
