import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";
const ThemeSwitch = dynamic(() => import("./theme-switch"), {
  ssr: true,
});
import { CACHE_KEY } from "@/lib/constants";
import Cart from "@/components/cart";
import OpenCart from "@/components/cart/open-cart";
import UserAccount from "@/components/customer";
import LogoIcon from "@/components/icons/logo";
import { getMenu } from "@/lib/bagisto";
import MobileSearch from "./mobile-search";
import dynamic from "next/dynamic";

export default async function Navbar() {
  const menu = await getMenu(CACHE_KEY.headerMenus);
  const menuData = [{ id: "", path: "/search", title: "All" }, ...menu];

  return (
    <header className="sticky top-0 z-10">
      <nav className="relative flex flex-col items-center justify-between gap-4 bg-neutral-50 p-4 dark:bg-neutral-900 md:flex-row lg:px-6">
        <div className="flex w-full items-center justify-between gap-0 sm:gap-4">
          <div className="flex max-w-fit gap-2 xl:gap-6">
            <Suspense fallback={null}>
              <MobileMenu menu={menuData} />
            </Suspense>
            <Link
              className="flex h-9 w-full scale-95 items-center md:h-9 md:w-auto lg:h-10"
              href="/"
            >
              <LogoIcon />
            </Link>
            {menu.length ? (
              <ul className="hidden gap-4 text-sm md:items-center lg:flex xl:gap-6">
                {menuData.slice(0, 3).map((item) => (
                  <li key={item?.id + item.title}>
                    <Link
                      className="text-nowrap relative text-neutral-500 before:absolute before:bottom-0 before:left-0 before:h-px before:w-0 before:bg-current before:transition-all before:duration-300 before:content-[''] hover:text-black hover:before:w-full dark:text-neutral-400 dark:hover:text-neutral-300"
                      href={`${item.path}`}
                      prefetch={true}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="hidden justify-center md:flex">
            <Suspense fallback={<SearchSkeleton />}>
              <Search search={false} />
            </Suspense>
          </div>
          <div className="flex max-w-fit gap-2 md:gap-4">
            <MobileSearch />
            <Suspense fallback={<OpenCart />}>
              <div className="hidden lg:block">
                <ThemeSwitch />
              </div>
            </Suspense>
            <Suspense fallback={<OpenCart />}>
              <Cart />
            </Suspense>
            <Suspense fallback={<OpenCart />}>
              <UserAccount />
            </Suspense>
          </div>
        </div>
      </nav>
    </header>
  );
}
