"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar } from "@heroui/avatar";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useCustomToast } from '@/utils/hooks/useToast';
import OpenAuth from "../OpenAuth";
import { isObject } from '@/utils/type-guards';
import { useState } from "react";
import { useGuestCartToken } from "@utils/hooks/useGuestCartToken";
import LoadingDots from "@components/common/icons/LoadingDots";
import { logoutAction } from "@utils/actions";


export default function CredentialModal() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useCustomToast();
  const [isOpen, setOpen] = useState(false);
  const { resetGuestToken } = useGuestCartToken();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { data: session } = useSession();

 const onSubmit = async () => {
  try {
    const res = await logoutAction();

    if (!res.success) {
      showToast(res.message, "danger");
    }

    const result = await signOut({
      callbackUrl: "/customer/login",
      redirect: false,
    });

    showToast("You are logged out successfully!", "success");
     await resetGuestToken();
    router.push(result.url);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Logout failed";
    showToast(message, "danger");
  }
};

  const content = (
    <PopoverContent className="min-w-[300px] px-4">
      {isObject(session?.user) ? (
        <div className="flex w-full flex-col gap-y-6 rounded-md py-4">
          <header>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar
                  isBordered
                  showFallback
                  color="default"
                  icon={<OpenAuth className="h-8" />}
                  size="md"
                />
                <div className="flex flex-col items-start justify-center">
                  <h4 className="font-semibold leading-none text-default-500 text-small dark:text-white">
                    {session?.user?.name}
                  </h4>
                  <h5 className="tracking-tight text-default-500 text-small dark:text-white">
                    {session?.user?.email}
                  </h5>
                </div>
              </div>

              <p className="pl-px text-default-500 text-small dark:text-white">
                Manage Cart, Orders
                <span aria-label="confetti" className="px-2" role="img">
                  🎉
                </span>
              </p>
            </div>
          </header>

          <footer>
            <form onSubmit={handleSubmit(onSubmit)}>
              <button
                className={clsx(
                  " w-full rounded-full bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
                  isSubmitting ? " cursor-not-allowed" : " cursor-pointer"
                )}
                type="submit"
              >
                <div className="mx-1">
                  {isSubmitting ? (
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
          </footer>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-y-6 rounded-md border-none py-4">
          <header className="">
            <div className="flex flex-col gap-y-2">
              <h4 className="text-xl font-semibold leading-none text-default-600 dark:text-white">
                Welcome Guest
              </h4>
              <p className="text-sm text-default-500 dark:text-white">
                Manage Cart, Orders
                <span aria-label="confetti" className="px-2" role="img">
                  🎉
                </span>
              </p>
            </div>
          </header>

          <footer className="flex gap-4">
            <Link className="w-full" href="/customer/login">
              <button
                className={clsx(
                  "w-full rounded-full bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                  pathname === "/customer/login"
                    ? " cursor-not-allowed"
                    : " cursor-pointer"
                )}
                disabled={pathname === "/customer/login"}
                type="button"
                onClick={() => setOpen(!isOpen)}
              >
                Sign In
              </button>
            </Link>

            <Link className="w-full" href="/customer/register">
              <button
                className={clsx(
                  "w-full rounded-full bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
                  pathname === "/customer/register"
                    ? " cursor-not-allowed"
                    : " cursor-pointer"
                )}
                disabled={pathname === "/customer/register"}
                type="button"
                onClick={() => setOpen(!isOpen)}
              >
                Sign Up
              </button>
            </Link>
          </footer>
        </div>
      )}
    </PopoverContent>
  );

  return (
    <Popover
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={() => setOpen(!isOpen)}
      defaultOpen={false}
      color="default"
      placement="bottom-end"
    >
      <PopoverTrigger>
        <button
          aria-label="Open cart"
          className="cursor-pointer bg-transparent"
        >
          <OpenAuth />
        </button>
      </PopoverTrigger>
      {content}
    </Popover>
  );
}
