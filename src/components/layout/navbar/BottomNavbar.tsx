import { usePathname } from "next/navigation";
import { CategoryIcon } from "@components/common/icons/CategoryIcon";
import { HomeIcon } from "@components/common/icons/HomeIcon";
import { IconSkeleton } from "@components/common/skeleton/IconSkeleton";
import Link from "next/link";
import { Suspense, memo } from "react";
import clsx from "clsx";
import OpenCart from "@components/cart/OpenCart";
import { useAppSelector } from "@/store/hooks";
import OpenAuth from "@components/customer/OpenAuth";

type Tab = "home" | "category" | "cart" | "account" | null;

const BottomNavbar = memo(function BottomNavbar({
  onMenuOpen: _onMenuOpen,
  activeTab,
  setActiveTab,
}: {
  onMenuOpen: () => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  const cartDetail = useAppSelector((state) => state.cartDetail);
  const pathname = usePathname();

  const isHidden = [
    "/customer/forget-password",
    "/account/orders",
    "/account/downloadable-products",
    "/compare",
    "/account/reviews",
    "/account/addresses",
    "/account/addresses/create",
    "/account/wishlist",
    "/account/profile",
    "/account/profile/edit",
  ].includes(pathname) ||
    pathname.startsWith("/account/orders/view/") ||
    pathname.startsWith("/account/addresses/edit/");

  if (isHidden) {
    return null;
  }

  const itemBase =
    "flex flex-col items-center justify-center gap-[4px] pt-[6px] pb-[6px] w-[71px] h-[64px] sm:w-[160px] sm:h-[64px] transition-colors cursor-pointer";

  const getIconWrapperClass = (tab: Tab) =>
    clsx(
      "flex shrink-0 items-center justify-center rounded-[16px] transition-all duration-300 w-[56px] h-[32px]",
      activeTab === tab
        ? "bg-selected-color dark:bg-selected-bg-bottom-dark text-black dark:text-white"
        : "bg-transparent text-neutral-900 dark:text-selected-white"
    );

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
      <nav className="h-[64px] border-t border-[#0000001A] bg-white dark:border-surface-darker dark:bg-surface-darker px-[8px] sm:px-[16px]">
        <div className="flex h-full items-center justify-between px-[16px] min-[412px]:gap-[32px]">

          <Link
            href="/"
            aria-label="Go to Home Page"
            onClick={() => setActiveTab("home")}
            className={itemBase}
          >
            <div className={getIconWrapperClass("home")}>
              <HomeIcon />
            </div>
            <span className={activeTab === "home" ? "font-semibold font-[14px]" : "font-normal font-[14px]"}>Home</span>
          </Link>

          <Link
            href="/categories"
            aria-label="Go to Categories"
            onClick={() => setActiveTab("category")}
            className={itemBase}
          >
            <div className={getIconWrapperClass("category")}>
              <CategoryIcon />
            </div>
            <span className={activeTab === "category" ? "font-semibold font-[14px]" : "font-normal font-[14px]"}>Categories</span>
          </Link>

          <Link
            href="/cart"
            aria-label="Go to Cart"
            onClick={() => setActiveTab("cart")}
            className={itemBase}
          >
            <div className={getIconWrapperClass("cart")}>
              <OpenCart quantity={cartDetail?.cart?.itemsQty} className="!h-6 !w-6" />
            </div>
            <span className={activeTab === "cart" ? "font-semibold font-[14px]" : "font-normal font-[14px]"}>Cart</span>
          </Link>

          <Suspense fallback={<IconSkeleton />}>
            <Link
              href="/account"
              aria-label="Go to Account"
              onClick={() => setActiveTab("account")}
              className={itemBase}
            >
              <div className={getIconWrapperClass("account")}>
                <OpenAuth className="!h-6 !w-6" />
              </div>
              <span className={activeTab === "account" ? "font-semibold font-[14px]" : "font-normal font-[14px]"}>Account</span>
            </Link>
          </Suspense>

        </div>
      </nav>
    </div>
  );
});

export default BottomNavbar;