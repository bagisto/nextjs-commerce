"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeCustomizationTypes, ThemeOptions } from "@/lib/bagisto/types";
import { isArray } from "@/lib/type-guards";
const getUrlparams = (url: string) => {
  const splitUrl = url.split("/");

  if (isArray(splitUrl)) {
    const urlLenght = splitUrl.length;

    if (urlLenght >= 1) {
      return `/${splitUrl.at(urlLenght - 1)}`;
    }
  }

  return "/";
};
const FooterMenuItem = ({ item }: { item: ThemeOptions }) => {
  const pathname = usePathname();

  return (
    <li>
      <Link
        className={clsx(
          "block px-0 py-1 md:p-2 text-nowrap text-sm underline-offset-4 hover:text-black hover:underline md:inline-block dark:hover:text-neutral-300",
          {
            "text-black dark:text-neutral-300": pathname === item.url,
          }
        )}
        href={`${getUrlparams(item.url)}`}
        prefetch={true}
      >
        {item.title}
      </Link>
    </li>
  );
};

export default function FooterMenu({
  menu,
}: {
  menu: ThemeCustomizationTypes[];
}) {
  if (!menu) return null;
  const menuList = menu.find((item) => item?.type === "footer_links");
  const channels = menuList?.translations?.at(0)?.options;

  return (
    <div className="flex justify-between gap-x-8 lg:gap-x-[50px]">
      {/* Render columns 1 */}
      {isArray(channels?.column_2) ? (
        <nav className="w-full lg:min-w-[160px] xl:min-w-[200px]">
          <ul>
            {channels?.column_1?.map((item, index) => {
              return <FooterMenuItem key={index} item={item} />;
            })}
          </ul>
        </nav>
      ) : null}

      {/* Render columns 2 */}
      {isArray(channels?.column_2) ? (
        <nav className="w-full lg:min-w-[160px] xl:min-w-[200px]">
          <ul>
            {channels?.column_2?.map((item, index) => {
              return <FooterMenuItem key={index} item={item} />;
            })}
          </ul>
        </nav>
      ) : null}

      {/* Render columns 3 */}
      {isArray(channels?.column_3) ? (
        <nav className="w-full lg:min-w-[160px] xl:min-w-[200px]">
          <ul>
            {channels?.column_3?.map((item, index) => {
              return <FooterMenuItem key={index} item={item} />;
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
