"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { useDisclosure } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@heroui/avatar";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useCustomToast } from '@/utils/hooks/useToast';
import { useMediaQuery } from "@utils/hooks/useMediaQueryHook";
import { useBodyScrollLock } from "@utils/hooks/useBodyScrollLock";
import OpenAuth from "../OpenAuth";
import { isObject } from '@/utils/type-guards';
import { useGuestCartToken } from "@utils/hooks/useGuestCartToken";
import LoadingDots from "@components/common/icons/LoadingDots";
import { logoutAction } from "@utils/actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser } from "@/store/slices/user-slice";
import { clearCart } from "@/store/slices/cart-slice";
import { EMAIL, removeFromLocalStorage } from "@/store/local-storage";
import ProfileDrawer from "../ProfileDrawer";
import ShortcutsDrawer from "../ShortcutsDrawer";
import { useState } from "react";
import MobileNavHeader from "@components/layout/navbar/MobileNavHeader";
import { IMAGES } from "@/utils/constants";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

const ShortcutIcon = () => (
  <Image src={IMAGES.settings} alt="Shortcuts" width={24} height={24} className="w-6 h-6 invert dark:invert-0" />
);


export default function CredentialModal({
  children,
  className,
  onOpen,
  onClose,
  isOpen,
  profile,
}: {
  children?: React.ReactNode;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
  profile?: any;
}) {
  const {
    isOpen: internalIsOpen,
    onOpen: internalOnOpen,
    onClose: internalOnClose,
    onOpenChange: _internalOnOpenChange,
  } = useDisclosure();
  
  const {
    isOpen: isProfileDrawerOpen,
    onOpen: onProfileDrawerOpen,
    onClose: onProfileDrawerClose,
  } = useDisclosure();

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const isControlled = isOpen !== undefined;
  const finalIsOpen = isControlled ? isOpen : internalIsOpen;
  const finalOnOpen = isControlled ? onOpen : internalOnOpen;
  const finalOnClose = isControlled ? onClose : internalOnClose;

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useCustomToast();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { resetGuestToken } = useGuestCartToken();

  useBodyScrollLock(finalIsOpen && !isDesktop);

  const finalOnOpenChange = (open: boolean) => {
    if (isControlled) {
      if (open) onOpen?.();
      else onClose?.();
    } else {
      if (open) internalOnOpen();
      else internalOnClose();
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
      removeFromLocalStorage(EMAIL)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Logout failed";
      showToast(message, "danger");
    }
  };

  const innerContent = (_onClose?: () => void) => (
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
              <p className={clsx("text-default-500 dark:text-selected-white",
                isDesktop ? "text-sm" : "text-lg")}>
                Manage Cart, Orders
                <span aria-label="confetti" className="px-2" role="img">
                  🎉
                </span>
              </p>
            </div>
          </header>

          <footer className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Link className="w-full" href="/customer/login" onClick={finalOnClose} aria-label="Go to sign in page">
                <button
                  className={clsx(
                    "w-full rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800",
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

              <Link className="w-full" href="/customer/register" onClick={finalOnClose} aria-label="Go to create account page">
                <button
                  className={clsx(
                    "w-full rounded-full bg-surface-navy px-5 py-3 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
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
            </div>
          </footer>
        </>
      )}
    </div>
  );

  if (isObject(session?.user)) {
    return (
      <>
        <button
          type="button"
          aria-label="Open profile drawer"
          className={clsx(className, "cursor-pointer bg-transparent")}
          onClick={isDesktop ? onProfileDrawerOpen : () => router.push("/account")}
        >
          {children ? children : <OpenAuth />}
        </button>
        {isDesktop ? (
          <ProfileDrawer 
            isOpen={isProfileDrawerOpen} 
            onClose={onProfileDrawerClose} 
            user={session.user} 
            profile={profile}
          />
        ) : (
          <>
          </>
        )}
      </>
    );
  }

  if (isDesktop) {
    return (
      <Popover
        backdrop="opaque"
        isOpen={finalIsOpen}
        onOpenChange={finalOnOpenChange}
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
          {innerContent(finalOnClose)}
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
        onClick={finalOnOpen}
      >
        {children ? children : <OpenAuth />}
      </button>

      <AnimatePresence>
        {finalIsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={finalOnClose}
              className="fixed inset-0 z-40 bg-transparent lg:hidden"
              style={{ top: "68px", bottom: "64px" }}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed right-0 z-50 flex flex-col bg-white dark:bg-black lg:hidden overflow-hidden"
              style={{
                top: 0,
                bottom: "64px",
                width: "100%",
                maxWidth: "448px",
              }}
            >
              <HideMainNavOnMobile />
              <MobileNavHeader onBack={finalOnClose} />

              <div className="flex flex-1 flex-col drawer-scrollbar-hidden w-full overflow-y-auto">
                <div className="w-full flex flex-col gap-6 pt-5 px-4 pb-8 flex-1">
                  <div className="pb-2.5 w-full flex items-center h-[30px] gap-2.5">
                    <h2 className="font-outfit font-semibold text-2xl text-black dark:text-white leading-none text-left">
                      Account
                    </h2>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    {innerContent(finalOnClose)}
                  </div>

                  <div className="mt-auto pt-10 flex justify-center w-full">
                    <button
                      onClick={() => setIsShortcutsOpen(true)}
                      className="w-[181px] h-[47px] bg-surface-muted text-black dark:bg-surface-navy dark:text-white rounded-full flex items-center justify-center gap-1 font-outfit font-medium text-lg leading-none px-10 py-3 shadow-none border-none outline-none"
                    >
                      <ShortcutIcon />
                      <span>Shortcuts</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ShortcutsDrawer 
        isOpen={isShortcutsOpen} 
        onClose={() => setIsShortcutsOpen(false)} 
        onNavigate={() => {
          setIsShortcutsOpen(false);
          finalOnClose?.();
        }}
      />
    </>
  );
}