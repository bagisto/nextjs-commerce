'use client';

import clsx from 'clsx';
import { ThemeCustomization, ThemeOptions } from 'lib/bagisto/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const FooterMenuItem = ({ item }: { item: ThemeOptions }) => {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.url);

  useEffect(() => {
    setActive(pathname === item.url);
  }, [pathname, item.url]);

  return (
    <li>
      <Link
        href={`/${item.url}`}
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
  const column_1 = menu?.[0]?.translations?.[0]?.options?.column_1 || [];
  const column_2 = menu?.[0]?.translations?.[0]?.options?.column_2 || [];
  const column_3 = menu?.[0]?.translations?.[0]?.options?.column_3 || [];

  const link = [{ url: '/', title: 'Home', sortOrder: '0' }];
  const column_1_data = [...link, ...column_1];

  return (
    <>
      <nav>
        <ul>
          {column_1_data?.map((item: ThemeOptions, index: number) => {
            return <FooterMenuItem key={index} item={item} />;
          })}
        </ul>
      </nav>
      <nav>
        <ul>
          {column_2?.map((item: ThemeOptions, index: number) => {
            return <FooterMenuItem key={index} item={item} />;
          })}
        </ul>
      </nav>
      <nav>
        <ul>
          {column_3?.map((item: ThemeOptions, index: number) => {
            return <FooterMenuItem key={index} item={item} />;
          })}
        </ul>
      </nav>
    </>
  );
}
