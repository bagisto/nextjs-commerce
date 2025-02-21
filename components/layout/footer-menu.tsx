'use client';

import clsx from 'clsx';
import { ThemeCustomization, ThemeOptions } from 'lib/bagisto/types';
import { isArray } from 'lib/type-guards';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
const getUrlparams = (url: string) => {
  const splitUrl = url.split('/');
  if (isArray(splitUrl)) {
    const urlLenght = splitUrl.length;
    if (urlLenght >= 1) {
      return `/${splitUrl.at(urlLenght - 1)}`;
    }
  }
  return '/';
};
const FooterMenuItem = ({ item }: { item: ThemeOptions }) => {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.url);

  useEffect(() => {
    setActive(pathname === item.url);
  }, [pathname, item.url]);

  return (
    <li>
      <Link
        href={`${getUrlparams(item.url)}`}
        className={clsx(
          'block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300',
          {
            'text-black dark:text-neutral-300': active
          }
        )}
      >
        {item.title}
      </Link>
    </li>
  );
};

export default function FooterMenu({ menu }: { menu: ThemeCustomization[] }) {
  if (!menu) return null;
  const menuList = menu.find((item) => item?.type === 'footer_links');
  const channels = menuList?.translations?.at(0)?.options;

  return (
    <>
      <nav>
        <ul>
          {channels?.column_1?.map((item: ThemeOptions, index: number) => {
            return <FooterMenuItem key={index} item={item} />;
          })}
        </ul>
      </nav>
      <nav>
        <ul>
          {channels?.column_2?.map((item: ThemeOptions, index: number) => {
            return <FooterMenuItem key={index} item={item} />;
          })}
        </ul>
      </nav>
      <nav>
        <ul>
          {channels?.column_3?.map((item: ThemeOptions, index: number) => {
            return <FooterMenuItem key={index} item={item} />;
          })}
        </ul>
      </nav>
    </>
  );
}
