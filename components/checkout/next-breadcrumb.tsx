'use client';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';
import LogoSquare from 'components/logo-square';
import { isObject } from 'lib/type-guards';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
type BreadCumbType = {
  label: 'Information' | 'Shipping' | 'Payment' | 'Place Order';
  href: string;
};
type BreadcrumbArray = BreadCumbType[];
const breadCrumbs: BreadcrumbArray = new Array(
  {
    label: 'Information',
    href: '/checkout/information'
  },
  {
    label: 'Shipping',
    href: '/checkout/shipping'
  },
  {
    label: 'Payment',
    href: '/checkout/payment'
  },
  {
    label: 'Place Order',
    href: '/checkout/place-order'
  }
);
const NextBreadcrumb = () => {
  const paths = usePathname();
  const [currentPage, setCurrentPage] = useState<BreadCumbType['label']>('Information');
  const currentPath = breadCrumbs?.find((item) => item.href === paths);
  useEffect(() => {
    if (isObject(currentPath)) {
      setCurrentPage(currentPath.label);
    }
  }, [paths, currentPath]);
  let informationPassed = false;
  const BreadCrumbsArray: BreadcrumbArray = breadCrumbs.map((crumb) => {
    if (crumb.href === paths) {
      informationPassed = true;
      return { ...crumb, href: paths };
    } else if (informationPassed) {
      return { ...crumb, href: '#' };
    } else {
      return { ...crumb };
    }
  });

  return (
    <header className="flex flex-col gap-4">
      <div className="hidden w-full flex-col gap-6 lg:flex">
        <Link href="/" aria-label="Acer logo" className=" flex w-full items-center">
          <LogoSquare />
          <div className="ml-2 flex-none text-sm font-medium uppercase">
            {process.env.SITE_NAME}
          </div>
        </Link>
      </div>
      <Breadcrumbs
        onAction={(value: any) => setCurrentPage(value)}
        color="success"
        classNames={{
          list: 'gap-0'
        }}
        size="md"
        itemClasses={{
          item: [
            'px-1 py-0.5 text-gray-700',
            'data-[current=true]:border-foreground data-[disabled=true]:text-blue-500 data-[current=true]:text-black dark:data-[current=true]:text-white  data-[current=true]:font-semibold'
          ],
          separator: 'block text-gray-500 dark:text-white'
        }}
      >
        {BreadCrumbsArray.map((item) => (
          <BreadcrumbItem
            key={item.label}
            isDisabled={item?.href === '#'}
            isCurrent={currentPage === item.label}
          >
            <Link href={item.href}>{item.label}</Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </header>
  );
};

export default NextBreadcrumb;
