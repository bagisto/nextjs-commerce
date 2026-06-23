"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar } from "@heroui/avatar";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import { useAppDispatch } from "@/store/hooks";
import { clearUser, setUser } from "@/store/slices/user-slice";
import { clearCart } from "@/store/slices/cart-slice";
import { logoutAction, getCustomerProfileAction } from "@utils/actions";
import { EMAIL, removeFromLocalStorage } from "@/store/local-storage";
import { deleteCookie } from "@utils/getCartToken";
import { GUEST_CART_TOKEN, GUEST_CART_ID, IMAGES } from "@/utils/constants";
import { useCustomToast } from "@/utils/hooks/useToast";
import LoadingDots from "@components/common/icons/LoadingDots";
import MobileNavHeader from "../layout/navbar/MobileNavHeader";
import ShortcutsDrawer from "./ShortcutsDrawer";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  profile?: any;
}

const Icon = ({ path, isActive, className }: { path: string, isActive: boolean, className?: string }) => (
  <div 
    className={clsx(
      "w-6 h-6 transition-colors shrink-0",
      isActive ? "bg-primary dark:bg-primary-soft" : "bg-black dark:bg-white",
      className
    )}
    style={{
      maskImage: `url(${path})`,
      maskRepeat: "no-repeat",
      maskPosition: "center",
      maskSize: "contain",
      WebkitMaskImage: `url(${path})`,
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      WebkitMaskSize: "contain",
    }}
  />
);

const RightArrow = () => (
  <Image src={IMAGES.arrowRight} alt="Arrow Right" width={24} height={24} className="w-6 h-6 invert dark:invert-0 shrink-0" />
);

const LogoutIcon = () => (
  <Image src={IMAGES.logout} alt="Logout" width={24} height={24} className="w-6 h-6 shrink-0" />
);

const ShortcutIcon = () => (
  <Image src={IMAGES.settings} alt="Shortcuts" width={24} height={24} className="w-6 h-6 invert dark:invert-0" />
);

function DrawerContent({
  customer,
  loading,
  isLoggingOut,
  handleLogout,
  isPageMode,
}: {
  customer: any;
  loading: boolean;
  isLoggingOut: boolean;
  handleLogout: () => void;
  isPageMode?: boolean;
}) {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Profile", iconPath: IMAGES.profile, href: "/account/profile" },
    { name: "Orders", iconPath: IMAGES.orders, href: "/account/orders" },
    { name: "Downloadable Products", iconPath: IMAGES.download, href: "/account/downloadable-products" },
    { name: "Product Compare", iconPath: IMAGES.compare, href: "/compare" },
    { name: "Wishlist", iconPath: IMAGES.wishlist, href: "/account/wishlist" },
    { name: "Reviews", iconPath: IMAGES.reviews, href: "/account/reviews" },
    { name: "Address", iconPath: IMAGES.address, href: "/account/addresses" },
  ];

  return (
    <>
      <HideMainNavOnMobile />

      {isPageMode && (
        <MobileNavHeader hideBack={true} variant="close" />
      )}

      <div className="flex-1 overflow-y-auto drawer-scrollbar-hidden flex flex-col w-full pt-5">
        <div className="w-full flex flex-col gap-6 pr-4 pb-8 pl-4">
          <div className="pb-2.5 w-full flex items-center h-[30px] gap-2.5">
            <h2 className="font-outfit font-semibold text-2xl text-black dark:text-white leading-none text-left">
              Account
            </h2>
          </div>

          <div className="flex flex-col w-full flex-1">
            <div className="flex items-center gap-3 w-full h-18">
              <Avatar
                src={customer?.image || undefined}
                className="w-18 h-18 rounded-[47px] border-none bg-neutral-100 dark:bg-neutral-800"
                showFallback
                imgProps={{ className: "object-cover" }}
                fallback={<Icon path={IMAGES.profile} isActive={false} className="w-18 h-18" />}
              />
              <div className="flex flex-col gap-3 flex-1 overflow-hidden h-[49px] justify-center">
                <h3 className="font-outfit text-xl font-medium text-black dark:text-white truncate leading-none">
                  {loading && !customer ? (
                    <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  ) : (
                    customer?.firstName || (customer?.name ? customer.name.split(" ")[0] : "User")
                  )}
                </h3>
                <p className="font-outfit text-base text-black/60 dark:text-selected-white truncate leading-none">
                  {loading && !customer ? (
                    <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mt-1" />
                  ) : (
                    customer?.email
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col w-full gap-2.5 flex-1">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "flex items-center justify-between transition-all font-outfit text-lg group w-full h-13 rounded-md p-3 gap-2.5 bg-transparent",
                      isActive 
                        ? "text-primary dark:text-primary-soft font-medium" 
                        : "text-black dark:text-white font-normal"
                    )}
                  >
                    <div className="flex items-center gap-3 h-7 flex-1">
                      <div className="shrink-0">
                        <Icon path={item.iconPath} isActive={isActive} className="w-6 h-6" />
                      </div>
                      <span className="leading-[28px] whitespace-nowrap truncate">{item.name}</span>
                    </div>
                    <RightArrow />
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center transition-all font-outfit text-lg group w-full h-13 rounded-md p-3 gap-2.5 text-danger-strong bg-transparent"
              >
                <div className="flex items-center gap-3 h-7 flex-1">
                  {isLoggingOut ? (
                    <LoadingDots className="bg-danger-strong" />
                  ) : (
                    <>
                      <div className="shrink-0">
                        <LogoutIcon />
                      </div>
                      <span className="leading-[28px] whitespace-nowrap truncate">Logout</span>
                    </>
                  )}
                </div>
              </button>

              <div className="mt-auto pt-10 flex justify-center">
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
        </div>
      </div>

      <ShortcutsDrawer 
        isOpen={isShortcutsOpen} 
        onClose={() => setIsShortcutsOpen(false)} 
        onNavigate={() => {
          setIsShortcutsOpen(false);
        }}
      />
    </>
  );
}

export default function AccountDrawer({ isOpen, onClose, user: initialUser, profile }: AccountDrawerProps) {
  const [customer, setCustomer] = useState(profile || initialUser);
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useCustomToast();

  const isPageMode = pathname === "/account";

  const fetchCustomerProfile = async () => {
    if (profile?.firstName || profile?.lastName) return;
    if (customer?.firstName || customer?.lastName) return;

    try {
      setLoading(true);
      const data = await getCustomerProfileAction();
      if (data) {
        setCustomer(data);
        dispatch(setUser({
          ...initialUser,
          ...data,
          name: `${data.firstName || ""} ${data.lastName || ""}`.trim() || data.name || initialUser?.name
        }));
      }
    } catch (error) {
      console.error("Error fetching customer profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCustomer(null);
      return;
    }

    if (profile) {
      setCustomer(profile);
    } else {
      setCustomer((prev: any) => {
        if (prev?.firstName || prev?.lastName) {
          return prev;
        }
        return initialUser;
      });
    }
  }, [initialUser, profile]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCustomerProfile();
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const res = await logoutAction();

      if (!res.success) {
        showToast(res.message, "danger");
      }

      await signOut({
        callbackUrl: "/customer/login",
        redirect: false,
      });

      dispatch(clearUser());
      dispatch(clearCart());

    
      deleteCookie(GUEST_CART_TOKEN);
      deleteCookie(GUEST_CART_ID);

      showToast("You are logged out successfully!", "success");

      removeFromLocalStorage(EMAIL);

      onClose();

      setTimeout(() => {
        router.push("/customer/login");
        router.refresh();
      }, 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Logout failed";
      showToast(message, "danger");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isPageMode) {
    return (
      <div className="fixed inset-x-0 top-0 bottom-16 z-50 flex flex-col bg-white dark:bg-surface-darkest lg:hidden drawer-scrollbar-hidden overflow-hidden"
        style={{
          top: "0px",
          bottom: "64px",
          height: "calc(var(--visual-viewport-height) - 64px)",
        }}
      >
        <DrawerContent
          customer={customer}
          loading={loading}
          isLoggingOut={isLoggingOut}
          handleLogout={handleLogout}
          isPageMode={true}
        />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-transparent lg:hidden"
            style={{ bottom: "64px" }}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed inset-x-0 top-0 bottom-16 z-50 flex flex-col bg-white dark:bg-black lg:hidden drawer-scrollbar-hidden overflow-hidden"
          >
            <MobileNavHeader onBack={onClose} variant="close" hideBack={true} />

            <DrawerContent
              customer={customer}
              loading={loading}
              isLoggingOut={isLoggingOut}
              handleLogout={handleLogout}
            />
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </>
  );
}