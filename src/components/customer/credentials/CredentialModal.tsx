"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Drawer, DrawerContent, DrawerBody, DrawerHeader, DrawerFooter } from "@heroui/drawer";
import { useDisclosure } from "@heroui/react";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar } from "@heroui/avatar";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useCustomToast } from '@/utils/hooks/useToast';
import { useMediaQuery } from "@utils/hooks/useMediaQueryHook";
import OpenAuth from "../OpenAuth";
import { isObject } from '@/utils/type-guards';
import { useGuestCartToken } from "@utils/hooks/useGuestCartToken";
import LoadingDots from "@components/common/icons/LoadingDots";
import { logoutAction } from "@utils/actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser } from "@/store/slices/user-slice";
import { clearCart } from "@/store/slices/cart-slice";


export default function CredentialModal({
  children,
  className,
  onClick,
  onClose: onCloseProp,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useCustomToast();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { resetGuestToken } = useGuestCartToken();

  const handleOpen = () => {
    onOpen();
    if (onClick) {
      onClick();
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange();
    if (!open && onCloseProp) {
      onCloseProp();
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { user } = useAppSelector((state) => state.user);
  const session = { user };

  const onSubmit = async () => {
    try {
      const res = await logoutAction();

      if (!res.success) {
        showToast(res.message, "danger");
      }

      await signOut({
        callbackUrl: "/customer/login",
        redirect: false,
      });

      await resetGuestToken();
      dispatch(clearUser());
      dispatch(clearCart());
      showToast("You are logged out successfully!", "success");
      setTimeout(() => {
        router.push("/customer/login");
        router.refresh();
      }, 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Logout failed";
      showToast(message, "danger");
    }
  };

  const innerContent = (onClose?: () => void) => (
    <div className={clsx("flex w-full flex-col rounded-md py-4", {
      "gap-y-6": !!session?.user || (!session?.user && isDesktop),
      "gap-y-10": !session?.user && !isDesktop,
    })}>
      {isObject(session?.user) ? (
        <>
          <header>
            <div className={clsx("flex flex-col gap-3", !isDesktop && "items-center justify-center")}>
              <div className={clsx("flex gap-3", !isDesktop ? "flex-col items-center" : "items-center")}>
                <Avatar
                  isBordered
                  showFallback
                  color="default"
                  icon={<OpenAuth className={clsx(isDesktop ? "h-8" : "h-12 w-12")} />}
                  size={isDesktop ? "md" : "lg"}
                  className={clsx(!isDesktop && "h-24 w-24 text-large")}
                />
                <div className={clsx("flex flex-col justify-center", !isDesktop ? "items-center gap-1" : "items-start")}>
                  <h4 className={clsx("leading-none dark:text-white", isDesktop ? "font-semibold text-default-500 text-small" : "text-xl font-bold text-black")}>
                    {session?.user?.name}
                  </h4>
                  <h5 className={clsx("tracking-tight dark:text-white", isDesktop ? "text-default-500 text-small" : "text-sm text-gray-500")}>
                    {session?.user?.email}
                  </h5>
                </div>
              </div>

              <p className={clsx("text-default-500 dark:text-white", isDesktop ? "text-small pl-px" : "text-center mt-2")}>
                Manage Cart, Orders
                <span aria-label="confetti" className="px-2" role="img">
                  🎉
                </span>
              </p>
            </div>
          </header>

          <footer>
            <form onSubmit={handleSubmit(onSubmit)} className={clsx(!isDesktop && "flex justify-center")}>
              <button
                className={clsx(
                  "rounded-full bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
                  isSubmitting ? " cursor-not-allowed" : " cursor-pointer",
                  isDesktop ? "w-full" : "w-40 min-w-[150px] mt-2"
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
        </>
      ) : (
        <>
          <header className={clsx({ "text-center": !isDesktop })}>
            <div className="flex flex-col gap-y-2">
              <h4 className={clsx("font-bold leading-none text-black dark:text-white",
                isDesktop ? "text-xl" : "text-3xl")}>
                Welcome Guest
              </h4>
              <p className={clsx("text-default-500 dark:text-neutral-400",
                isDesktop ? "text-sm" : "text-lg")}>
                Manage Cart, Orders
                <span aria-label="confetti" className="px-2" role="img">
                  🎉
                </span>
              </p>
            </div>
          </header>

          <footer className="flex gap-4">
            <Link className="w-full" href="/customer/login" onClick={onClose} aria-label="Go to sign in page">
              <button
                className={clsx(
                  "w-full rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                  pathname === "/customer/login"
                    ? " cursor-not-allowed"
                    : " cursor-pointer"
                )}
                disabled={pathname === "/customer/login"}
                type="button"
              >
                Sign In
              </button>
            </Link>

            <Link className="w-full" href="/customer/register" onClick={onClose} aria-label="Go to create account page">
              <button
                className={clsx(
                  "w-full rounded-full bg-[#1e293b] px-5 py-3 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
                  pathname === "/customer/register"
                    ? " cursor-not-allowed"
                    : " cursor-pointer"
                )}
                disabled={pathname === "/customer/register"}
                type="button"
              >
                Sign Up
              </button>
            </Link>
          </footer>
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Popover
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        defaultOpen={false}
        color="default"
        placement="bottom-end"
      >
        <PopoverTrigger>
          <button
            type="button"
            aria-label="Open account"
            className={clsx(className, "cursor-pointer bg-transparent")}
          >
            {children ? children : <OpenAuth />}
          </button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[300px] px-4">
          {innerContent(() => onOpenChange())}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open account"
        className={clsx(className, "cursor-pointer bg-transparent")}
        onClick={handleOpen}
      >
        {children ? children : <OpenAuth />}
      </button>

      <Drawer
        backdrop="transparent"
        hideCloseButton
        isOpen={isOpen}
        radius="none"
        onOpenChange={handleOpenChange}
        classNames={{
          base: "z-50",
          backdrop: "z-40",
          wrapper: "top-[68px] bottom-[64px]",
        }}
      >
        <DrawerContent className="z-50 h-[calc(var(--visual-viewport-height)-132px)] max-h-[calc(var(--visual-viewport-height)-132px)]">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold">Account</p>
                </div>
              </DrawerHeader>

              <DrawerBody className="flex flex-col justify-center py-0">
                {innerContent(onClose)}
              </DrawerBody>

              <DrawerFooter className="flex flex-col gap-1" />
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
