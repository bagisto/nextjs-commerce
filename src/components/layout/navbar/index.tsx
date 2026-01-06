import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./MobileMenu";
import Search from "./Search";
import MobileSearch from "./MobileSearch";
import Cart from "@/components/cart";
import { SearchSkeleton } from "@/components/common/skeleton/SearchSkeleton";
import { IconSkeleton } from "@/components/common/skeleton/IconSkeleton";
import { GET_TREE_CATEGORIES, graphqlRequest } from "@/graphql";
import ThemeSwitcherWrapper from "@components/theme/theme-switch";
import LogoIcon from "@components/common/icons/LogoIcon";
import UserAccount from "@components/customer/credentials";

export default async function Navbar() {
  const data = await graphqlRequest<any>(
    GET_TREE_CATEGORIES,
    { parentId: 1 },
    { tags: ["categories"], life: "days" }
  );

  const categories = data?.treeCategories || [];

  const filteredCategories = categories
    .filter((cat: any) => cat.id !== "1")
    .map((cat: any) => {
      const translation = cat.translations?.edges?.[0]?.node;
      return {
        id: cat.id,
        name: translation?.name || "",
        slug: translation?.slug || "",
      };
    })
    .filter((item: any) => item.name && item.slug); 

  const menuData = [
    { id: "all", name: "All", slug: "" },
    ...filteredCategories.slice(0, 3),
  ];

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
            <ul className="hidden gap-4 text-sm md:items-center lg:flex xl:gap-6">
              {menuData.map(
                (item: { id: string; name: string; slug: string }) => (
                  <li key={item?.id + item?.name}>
                    <Link
                      className="text-nowrap relative text-neutral-500 before:absolute before:bottom-0 before:left-0 before:h-px before:w-0 before:bg-current before:transition-all before:duration-300 before:content-[''] hover:text-black hover:before:w-full dark:text-neutral-400 dark:hover:text-neutral-300"
                      href={item.slug ? `/search/${item.slug}` : "/search"}
                      prefetch={true}
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="hidden justify-center md:flex">
            <Suspense fallback={<SearchSkeleton />}>
              <Search search={false} />
            </Suspense>
          </div>
          <div className="flex max-w-fit gap-2 md:gap-4">
            <MobileSearch />
            <div className="hidden lg:block">
              <ThemeSwitcherWrapper />
            </div>
            <Cart />
            <Suspense fallback={<IconSkeleton />}>
              <UserAccount />
            </Suspense>
          </div>
        </div>
      </nav>
    </header>
  );
}
