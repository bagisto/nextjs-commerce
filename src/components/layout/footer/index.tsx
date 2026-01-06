import Link from "next/link";
import { Suspense } from "react";
import { isObject } from "@/utils/type-guards";
import { getThemeCustomization } from "@/utils/bagisto";
import LogoIcon from "@components/common/icons/LogoIcon";
import FaceBookIcon from "@components/common/icons/social-icon/FaceBookIcon";
import InstaGramIcon from "@components/common/icons/social-icon/InstaGramIcon";
import TwitterIcon from "@components/common/icons/social-icon/TwitterIcon";
import Subscribe from "./Subscribe";
import FooterMenu from "./FooterMenu";
import ServiceContent from "./ServiceContent";
import { ThemeCustomizationTranslationEdge } from "@/types/theme/theme-customization";
const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2010 + (currentYear > 2010 ? `-${currentYear}` : "");
  const skeleton =
    "w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700";
  const menu = await getThemeCustomization();
  const copyrightName = COMPANY_NAME || SITE_NAME || "";
  const services = menu?.services_content?.themeCustomizations?.edges?.[0]?.node;

  return (
    <>
      <div className="mx-auto my-8 w-full sm:my-12 md:my-20 md:max-w-4xl">
        {isObject(services) && services?.translations?.edges && (
          <ServiceContent
            name={services?.name}
            serviceData={services?.translations?.edges?.map((edge: ThemeCustomizationTranslationEdge) => edge.node)}
          />
        )}
      </div>
      <footer className="border-t border-neutral-200 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col justify-between gap-6 gap-y-6 px-6 py-12 text-sm dark:border-neutral-700 min-[880px]:flex-row min-[880px]:gap-12 min-[880px]:gap-y-20 min-[880px]:px-4">
          <div className="flex flex-col gap-[14px]">
            <Link className="flex items-center gap-2 md:pt-1" href="/">
              <LogoIcon />
            </Link>
            <div className="flex gap-[14px]">
              <Link href="#" className="cursor-pointer">
                <FaceBookIcon />
              </Link>
              <Link href="#" className="cursor-pointer">
                <InstaGramIcon />
              </Link>
              <Link href="#" className="cursor-pointer">
                <TwitterIcon />
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-x-8 md:flex-row lg:gap-x-[50px]">
            <Suspense
              fallback={
                <div className="flex h-[188px] w-[200px] flex-col gap-2">
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className={skeleton} />
                    ))}
                </div>
              }
            >
              <FooterMenu menu={menu?.footer_links?.themeCustomizations?.edges} />
            </Suspense>
            <Subscribe />
          </div>
        </div>
        <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col justify-center gap-1 px-4 md:flex-row">
            <p className="text-center">
              &copy; {copyrightDate} {copyrightName}
              {copyrightName.length && !copyrightName.endsWith(".")
                ? "."
                : ""}{" "}
              All rights reserved.
            </p>
            <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
            <p className="text-center">Designed in Bagisto</p>
          </div>
        </div>
      </footer>
    </>
  );
}
