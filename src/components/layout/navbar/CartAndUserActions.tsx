import { Suspense } from "react";
import Cart from "@/components/cart";
import UserAccount from "@components/customer/credentials";
import ThemeSwitcherWrapper from "@components/theme/theme-switch";
import { IconSkeleton } from "@/components/common/skeleton/IconSkeleton";
import { SessionManager } from "@/providers";

export function CartAndUserActions() {
  return (
    <div className="flex max-w-fit gap-2 md:gap-4">
      <div className="flex">
        <ThemeSwitcherWrapper />
      </div>
      <div className="hidden lg:block">
        <Cart />
      </div>
      <Suspense fallback={<IconSkeleton />}>
        <div className="hidden lg:block">
          <SessionManager>
            <UserAccount />
          </SessionManager>
        </div>
      </Suspense>
    </div>
  );
}
