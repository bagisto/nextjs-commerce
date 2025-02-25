import { LoginForm } from 'components/customer/login/login-form';
import Link from 'next/link';
import LogoSquare from '../../../../components/logo-square';

export const metadata = { title: 'Search', description: 'Search for products in the store.' };
const { SITE_NAME } = process.env;

export default async function LoginPage() {
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
      <LoginForm />
    </div>
  );
}
