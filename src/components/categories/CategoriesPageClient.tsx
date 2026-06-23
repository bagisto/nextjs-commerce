"use client";

import Image from "next/image";
import Link from "next/link";
import { useBodyScrollLock } from "@utils/hooks/useBodyScrollLock";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { IMAGES } from "@/utils/constants";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

interface CategoriesPageClientProps {
  categories: { id: string; name: string; slug: string }[];
}

const RightArrow = () => (
  <Image src={IMAGES.arrowRight} alt="Arrow Right" width={24} height={24} className="w-6 h-6 invert dark:invert-0 shrink-0" />
);

export default function CategoriesPageClient({ categories }: CategoriesPageClientProps) {
  useBodyScrollLock(true);

  return (
    <>
      <HideMainNavOnMobile />
      <div className="fixed inset-x-0 top-0 bottom-16 z-50 flex flex-col bg-white dark:bg-surface-darkest lg:hidden drawer-scrollbar-hidden overflow-hidden"
        style={{
          top: "0px",
          bottom: "64px",
          height: "calc(var(--visual-viewport-height) - 64px)",
        }}
      >
        <MobileNavHeader hideBack={true} />

        <div className="h-full overflow-y-auto px-4 pt-5 pb-4 drawer-scrollbar-hidden">
          <h1 className="mt-0 px-2 text-2xl font-semibold text-black dark:text-white">
            Category
          </h1>

          <ul className="mt-2 flex w-full flex-col drawer-scrollbar-hidden">
            {categories.map((item) => (
              <li
                key={item.id + item.name}
                className="w-full"
              >
                <Link
                  href={item.slug ? `/search/${item.slug}` : "/search"}
                  aria-label={`${item?.name}`}
                  className="flex items-center justify-between transition-all font-outfit text-lg group w-full h-13 rounded-md p-3 gap-2.5 text-black dark:text-white"
                >
                  <span className="leading-[28px] whitespace-nowrap truncate">{item.name}</span>
                  <RightArrow />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}