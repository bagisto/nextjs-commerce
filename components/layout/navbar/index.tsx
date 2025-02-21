import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import UserAccount from 'components/customer';
import LogoSquare from 'components/logo-square';
import { getMenu } from 'lib/bagisto';
import { Menu } from 'lib/bagisto/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';
const { SITE_NAME } = process.env;
export default async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');
  const menuData = [{ id: '', path: '/search', title: 'All' }, ...menu];
  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link href="/" className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menuData.slice(0, 3).map((item: Menu) => (
                <li key={item?.id + item.title}>
                  <Link
                    href={`${item.path}`}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end gap-4 md:w-1/3">
          <Suspense fallback={<OpenCart />}>
            <Cart />
          </Suspense>
          <Suspense fallback={<OpenCart />}>
            <UserAccount />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
