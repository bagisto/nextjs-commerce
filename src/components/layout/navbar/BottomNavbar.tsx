"use client";

import Cart from "@components/cart";
import { CategoryIcon } from "@components/common/icons/CategoryIcon";
import { HomeIcon } from "@components/common/icons/HomeIcon";
import { IconSkeleton } from "@components/common/skeleton/IconSkeleton";
import UserAccount from "@components/customer/credentials";
import Link from "next/link";
import { Suspense, memo } from "react";
import clsx from "clsx";

type Tab = "home" | "category" | "cart" | "account";

const BottomNavbar = memo(function BottomNavbar({
  onMenuOpen,
  activeTab,
  setActiveTab,
}: {
  onMenuOpen: () => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  const itemBase =
    "flex flex-col items-center gap-1 text-xs font-semibold py-2 rounded-lg transition-colors";

  const getIconWrapperClass = (tab: Tab) =>
    clsx(
      "flex items-center justify-center rounded-full transition-all duration-300 px-6 py-1",
      activeTab === tab ? "bg-selected-color dark:bg-selected-color-dark" : "bg-transparent"
    );

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
      <nav className="h-16 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
        <div className="flex h-full items-center justify-between">

          {/* Home */}
          <Link
            href="/"
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
          <div
            onClick={() => setActiveTab("cart")}
            className={itemBase}
          >
            <div className={getIconWrapperClass("cart")}>
              <Cart />
            </div>
            <span>Cart</span>
          </div>

          {/* Account */}
          <Suspense fallback={<IconSkeleton />}>
            <div
              onClick={() => setActiveTab("account")}
              className={itemBase}
            >
              <div className={getIconWrapperClass("account")}>
                <UserAccount />
              </div>
              <span>Account</span>
            </div>
          </Suspense>

        </div>
      </nav>
    </div>
  );
});

export default BottomNavbar;
