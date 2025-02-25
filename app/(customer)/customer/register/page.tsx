import RegistrationForm from 'components/customer/login/registration-form';
import LogoSquare from 'components/logo-square';
import Link from 'next/link';

export const metadata = {
  title: 'Registration Form',
  description: 'Customer registration page'
};
const { SITE_NAME } = process.env;
export default async function Register() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-24 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="justify-center lg:flex">
          <Link
            className="flex items-center justify-center gap-2 text-black md:pt-1 dark:text-white"
            href="/"
          >
            <LogoSquare />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
      </div>
      <RegistrationForm />
    </div>
  );
}
