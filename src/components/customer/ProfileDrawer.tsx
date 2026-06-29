"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerBody,
} from "@heroui/drawer";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/react";
import {
  User,
  Heart,
  ArrowLeftRight,
  MapPin,
  X
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCustomToast } from "@/utils/hooks/useToast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser, setUser } from "@/store/slices/user-slice";
import { clearCart } from "@/store/slices/cart-slice";
import { logoutAction, getCustomerProfileAction } from "@utils/actions";
import { EMAIL, removeFromLocalStorage } from "@/store/local-storage";
import { deleteCookie } from "@utils/getCartToken";
import { GUEST_CART_TOKEN, GUEST_CART_ID } from "@/utils/constants";
import LoadingDots from "@components/common/icons/LoadingDots";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  profile?: any;
}

export default function ProfileDrawer({ isOpen, onClose, user: initialUser, profile }: ProfileDrawerProps) {
  const [customer, setCustomer] = useState(profile || initialUser);
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.user.user);
  const activeUser = reduxUser || customer;
  const { showToast } = useCustomToast();

  const fetchCustomerProfile = async () => {
    if (profile?.firstName || profile?.lastName) {
      return;
    }

    if (customer?.firstName || customer?.lastName) {
      return;
    }

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

  const navLinks = [
    { name: "Profile", icon: <User size={24} strokeWidth={1.5} />, href: "/account/profile" },
    { name: "Wishlist", icon: <Heart size={24} strokeWidth={1.5} />, href: "/account/wishlist" },
    { name: "Compare", icon: <ArrowLeftRight size={24} strokeWidth={1.5} />, href: "/compare" },
    { name: "Address", icon: <MapPin size={24} strokeWidth={1.5} />, href: "/account/addresses" },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="right"
      size="sm"
      radius="none"
      classNames={{
        base: "bg-white dark:bg-neutral-900 h-full",
      }}
      hideCloseButton
    >
      <DrawerContent>
        <div className="flex h-full flex-col relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-10"
          >
            <X size={24} className="text-selected-black dark:text-selected-white" />
          </button>

          <DrawerBody className="p-0 flex flex-col h-full">
            <div className="flex flex-col items-center pt-12 pb-4 px-6 w-full">
              {loading && !activeUser ? (
                <div className="flex flex-col items-center w-full animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 mt-8 mb-1" />
                  <div className="h-7 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mt-2 mb-1" />
                  <div className="h-5 w-44 bg-neutral-200 dark:bg-neutral-800 rounded mt-1" />
                  <div className="h-5 w-36 bg-neutral-200 dark:bg-neutral-800 rounded mt-2" />
                </div>
              ) : (
                <>
                  <Avatar
                    src={activeUser?.image || undefined}
                    className="w-16 h-16 text-large mb-1 border-2 border-neutral-100 dark:border-neutral-800 mt-8"
                    showFallback
                    fallback={<User size={48} className="text-neutral-400 dark:text-selected-black" />}
                  />
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white min-h-7 flex items-center justify-center text-center">
                    {activeUser?.firstName || activeUser?.lastName ? (
                      `${activeUser?.firstName || ""} ${activeUser?.lastName || ""}`.trim()
                    ) : (
                      <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                    )}
                  </h2>
                  <p className="text-base text-selected-black dark:text-selected-white mt-1 min-h-5 flex items-center justify-center text-center">
                    {activeUser?.email || ""}
                  </p>
                  <p className="text-base text-selected-black dark:text-selected-white mt-2">
                    Manage Cart, Orders <span role="img" aria-label="confetti">🎉</span>
                  </p>
                </>
              )}
            </div>

            <div className="flex-1 px-4 mt-0">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-900 dark:text-white"
                  >
                    <span className="opacity-70">{link.icon}</span>
                    <span className="text-sm md:text-lg font-medium">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 mt-auto">
              <Button
                onClick={handleLogout}
                isLoading={isLoggingOut}
                className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-6 rounded-full text-lg"
                spinner={<LoadingDots className="bg-white" />}
              >
                Logout
              </Button>
            </div>
          </DrawerBody>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
