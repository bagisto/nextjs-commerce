"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCustomToast } from "@/utils/hooks/useToast";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/user-slice";
import { clearCart } from "@/store/slices/cart-slice";
import { logoutAction } from "@utils/actions";
import { EMAIL, removeFromLocalStorage } from "@/store/local-storage";
import { deleteCookie } from "@utils/getCartToken";
import { GUEST_CART_TOKEN, GUEST_CART_ID } from "@/utils/constants";
import LoadingDots from "@components/common/icons/LoadingDots";
import AccountBreadcrumbs from "@/components/layout/AccountBreadcrumbs";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

interface ProfileDetailsProps {
  user: any;
}

export default function ProfileDetails({ user }: ProfileDetailsProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useCustomToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const details = [
    { label: "First Name", value: user?.firstName },
    { label: "Last Name", value: user?.lastName },
    { label: "Gender", value: user?.gender || "Not specified" },
    { label: "Date of Birth", value: user?.dateOfBirth || "Not specified" },
    { label: "Email", value: user?.email },
  ];

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

  return (
    <div className="flex flex-col w-full">
      <HideMainNavOnMobile />
      <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
              <MobileNavHeader backUrl="/account" />
      </div>

      <div className="hidden lg:block">
          <AccountBreadcrumbs />
      </div>

      <div className="flex items-center justify-between mt-5 lg:mt-2.5 mb-6 lg:mb-7_5 lg:mb-10">
        <div className="flex items-center gap-3">
          <h1 className="font-outfit font-semibold text-2xl leading-[24px] lg:font-medium lg:text-26 lg:leading-[40px] text-black dark:text-white text-left">
            Profile
          </h1>
        </div>
        <Button
          onClick={() => router.push("/account/profile/edit")}
          className="flex items-center justify-center gap-1.5 w-[100px] h-[45px] lg:w-[130px] lg:h-13 lg:px-[50px] lg:py-4 rounded-full border border-primary dark:border-primary-soft text-primary dark:text-primary-soft bg-transparent font-outfit font-semibold text-base leading-[100%] hover:bg-primary dark:hover:bg-primary-soft/10 hover:text-white dark:hover:text-primary-soft transition-all duration-300"
        >
          Edit
        </Button>
      </div>

      <div className="flex flex-col gap-[25px]">
        {details.map((detail) => (
          <div 
            key={detail.label}
            className="flex flex-row items-center h-[45px] border-b border-border dark:border-neutral-800 w-full max-w-[1170px]"
          >
            <span className="w-[140px] sm:w-[280px] font-outfit font-medium text-black dark:text-white text-sm lg:text-base leading-none tracking-[0.01em] flex items-center">
              {detail.label}
            </span>
            <span className="flex-1 font-outfit font-medium text-muted dark:text-selected-white text-sm lg:text-base leading-none tracking-[0.01em] flex items-center">
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button
          onClick={handleLogout}
          isLoading={isLoggingOut}
          className="bg-primary hover:bg-blue-700 text-white font-semibold w-[160px] h-12 lg:w-[211px] lg:h-13 lg:px-20 lg:py-4 gap-2.5 rounded-full text-base leading-[100%] font-outfit transition-all flex items-center justify-center"
          spinner={<LoadingDots className="bg-white" />}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
