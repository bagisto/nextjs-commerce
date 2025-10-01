import Link from "next/link";
import { ThemeCustomizationTypes, ThemeOptions } from "@/lib/bagisto/types";
import { isArray } from "@/lib/type-guards";

const getUrlparams = (url: string) => {
  const splitUrl = url.split("/");
  
  if (isArray(splitUrl)) {
    const urlLength = splitUrl.length;
    
    if (urlLength >= 1) {
      return `/${splitUrl.at(urlLength - 1)}`;
    }
  }
  
  return "/";
};

const FooterMenuItem = ({ item }: { item: ThemeOptions }) => {
  return (
    <li>
      <Link
        className="block px-0 py-1 md:p-2 text-nowrap text-sm underline-offset-4 hover:text-black hover:underline md:inline-block dark:hover:text-neutral-300"
        href={getUrlparams(item.url)}
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
            {channels?.column_1?.map((item: any, index: number) => {
              return <FooterMenuItem key={index} item={item} />;
            })}
          </ul>
        </nav>
      ) : null}

      {/* Render columns 2 */}
      {isArray(channels?.column_2) ? (
        <nav className="w-full lg:min-w-[160px] xl:min-w-[200px]">
          <ul>
            {channels?.column_2?.map((item: any, index: number) => {
              return <FooterMenuItem key={index} item={item} />;
            })}
          </ul>
        </nav>
      ) : null}

      {/* Render columns 3 */}
      {isArray(channels?.column_3) ? (
        <nav className="w-full lg:min-w-[160px] xl:min-w-[200px]">
          <ul>
            {channels?.column_3?.map((item: any, index: number) => {
              return <FooterMenuItem key={index} item={item} />;
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
