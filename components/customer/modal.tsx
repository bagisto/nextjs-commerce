'use client';
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@heroui/react';
import clsx from 'clsx';
import LoadingDots from 'components/loading-dots';
import { isObject } from 'lib/type-guards';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { userLogoOut } from './lib/action';
import OpenAuth from './open-auth';
export default function CredentialModal() {
  const [isLoading, setLoader] = useState<string>('');

  const { data: session } = useSession();
  const [status, handleLogout] = useFormState(userLogoOut, undefined);

  useEffect(() => {
    if (status?.success) {
      signOut({ callbackUrl: '/customer/login', redirect: false });
    } else if (status?.error) {
      console.error('Something gone wrong !');
    }
  }, [status]);
  const loadStatusHandler = (type: string) => {
    if (typeof window !== 'undefined') {
      (window as any).isLogOutLoading = true;
    }
    isLoading === '' && setLoader(type);
  };
  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <button aria-label="Open cart">
          <OpenAuth />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-1 dark:bg-black">
        {isObject(session?.user) ? (
          <Card shadow="none" className="max-w-[300px] border-none bg-transparent">
            <CardHeader className="justify-between">
              <div className="flex gap-3">
                <Avatar
                  showFallback
                  isBordered
                  color="default"
                  size="md"
                  icon={<OpenAuth className="h-8" />}
                />
                <div className="flex flex-col items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-500 dark:text-white">
                    {session?.user?.name}
                  </h4>
                  <h5 className="text-small tracking-tight text-default-500 dark:text-white">
                    {session?.user?.email}
                  </h5>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0">
              <p className="pl-px text-small text-default-500 dark:text-white">
                Manage Cart, Orders
                <span aria-label="confetti" className="px-2" role="img">
                  🎉
                </span>
              </p>
            </CardBody>
            <CardFooter>
              <form action={handleLogout}>
                <button
                  onClick={() => loadStatusHandler('logout')}
                  type="submit"
                  className={clsx(
                    'my-2 w-full rounded-full bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700',
                    isLoading === 'logout' ? 'cursor-not-allowed' : ''
                  )}
                >
                  <div className="mx-1">
                    {isLoading === 'logout' ? (
                      <div className="flex items-center justify-center">
                        <p>Loading</p>
                        <LoadingDots className="bg-white" />
                      </div>
                    ) : (
                      <p> Log Out</p>
                    )}
                  </div>
                </button>
              </form>
            </CardFooter>
          </Card>
        ) : (
          <Card shadow="none" className="min-w-[300px] border-none bg-transparent">
            <CardHeader className="justify-between">
              <div className="flex gap-3">
                <h4 className="text-xl font-semibold leading-none text-default-600 dark:text-white">
                  Welcome Guest
                </h4>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0">
              <p className="pl-px text-small text-default-500 dark:text-white">
                Manage Cart, Orders
                <span aria-label="confetti" className="px-2" role="img">
                  🎉
                </span>
              </p>
            </CardBody>
            <CardFooter className="my-2 flex gap-4">
              <Link
                onClick={() => loadStatusHandler('login')}
                href="/customer/login"
                className="w-full"
              >
                <button
                  type="button"
                  className={clsx(
                    'mb-2 w-full rounded-full bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
                    isLoading === 'login' ? 'cursor-not-allowed' : ''
                  )}
                >
                  <div className="mx-1">
                    {isLoading === 'login' ? (
                      <div className="flex items-center justify-center">
                        <p>Loading</p>
                        <LoadingDots className="bg-white" />
                      </div>
                    ) : (
                      <p> Sign In</p>
                    )}
                  </div>
                </button>
              </Link>
              <Link href="/customer/register" className="w-full">
                <button
                  onClick={() => loadStatusHandler('signup')}
                  type="button"
                  className={clsx(
                    'mb-2 w-full rounded-full bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700',
                    isLoading === 'signup' ? 'cursor-not-allowed' : ''
                  )}
                >
                  <div className="mx-1">
                    {isLoading === 'signup' ? (
                      <div className="flex items-center justify-center">
                        <p>Loading</p>
                        <LoadingDots className="bg-white" />
                      </div>
                    ) : (
                      <p> Sign Up</p>
                    )}
                  </div>
                </button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </PopoverContent>
    </Popover>
  );
}
