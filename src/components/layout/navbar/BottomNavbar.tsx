"use client";

import Cart from "@components/cart";
import { CategoryIcon } from "@components/common/icons/CategoryIcon";
import { HomeIcon } from "@components/common/icons/HomeIcon";
import { IconSkeleton } from "@components/common/skeleton/IconSkeleton";
import UserAccount from "@components/customer/credentials";
import Link from "next/link";
import { Suspense, memo } from "react";
import clsx from "clsx";
import OpenCart from "@components/cart/OpenCart";
import { useAppSelector } from "@/store/hooks";
import OpenAuth from "@components/customer/OpenAuth";

type Tab = "home" | "category" | "cart" | "account" | null;

const BottomNavbar = memo(function BottomNavbar({
  onMenuOpen,
  activeTab,
  setActiveTab,
}: {
  onMenuOpen: () => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  const cartDetail = useAppSelector((state) => state.cartDetail);
  const itemBase =
    "flex flex-col items-center gap-1 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer";

  const getIconWrapperClass = (tab: Tab) =>
    clsx(
      "flex items-center justify-center rounded-full transition-all duration-300 px-6 py-1",
      activeTab === tab
        ? "bg-selected-color dark:bg-selected-bg-bottom-dark dark:text-selected-bottom-dark"
        : "bg-transparent text-neutral-900 dark:text-neutral-400"
    );

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
      <nav className="px-3 h-16 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
        <div className="flex h-full items-center justify-between">

          {/* Home */}
          <Link
            href="/"
            aria-label="Go to Home Page"
            onClick={() => setActiveTab("home")}
            className={itemBase}
          >
            <div className={getIconWrapperClass("home")}>
              <HomeIcon />
            </div>
            <span>Home</span>
          </Link>

          {/* Categories */}
          <button
            onClick={() => {
              setActiveTab("category");
              onMenuOpen();
            }}
            type="button"
            className={itemBase}
          >
            <div className={getIconWrapperClass("category")}>
              <CategoryIcon />
            </div>
            <span>Categories</span>
          </button>

          {/* Cart */}
          <Cart
            className={itemBase}
            onClick={() => setActiveTab("cart")}
            onClose={() => setActiveTab(null)}
          >
            <div className={getIconWrapperClass("cart")}>
              <OpenCart quantity={cartDetail?.cart?.itemsQty} />
            </div>
            <span>Cart</span>
          </Cart>

          {/* Account */}
          <Suspense fallback={<IconSkeleton />}>
            <UserAccount
              className={itemBase}
              onClick={() => setActiveTab("account")}
              onClose={() => setActiveTab(null)}
            >
              <div className={getIconWrapperClass("account")}>
                <OpenAuth />
              </div>
              <span>Account</span>
            </UserAccount>
          </Suspense>

        </div>
      </nav>
    </div>
  );
});

export default BottomNavbar;
