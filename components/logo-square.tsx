import clsx from 'clsx';
import { getChennel } from 'lib/bagisto';
import Image from 'next/image';
import Link from 'next/link';
export default async function LogoSquare({
  size,
  header
}: {
  size?: 'sm' | undefined;
  header?: boolean;
}) {
  const storeConfig = await getChennel();
  return (
    <Link
      href="/"
      className={clsx(
        'mr-2 flex w-full items-center  md:w-auto lg:mr-6',
        header && 'justify-center'
      )}
    >
      <div
        className={clsx(
          'flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black',
          {
            'h-[40px] w-[40px] rounded-xl': !size,
            'h-[30px] w-[30px] rounded-lg': size === 'sm'
          }
        )}
      >
        <Image
          src={storeConfig?.logoUrl}
          width={16}
          height={16}
          className={clsx({
            'h-[16px] w-[16px]': !size,
            'h-[10px] w-[10px]': size === 'sm'
          })}
          alt="Picture of the author"
        />
      </div>
      <div className="ml-2 flex-none text-base font-medium md:hidden lg:block">
        {storeConfig?.name}
      </div>
    </Link>
  );
}
