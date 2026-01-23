import { FC } from "react";
import type { FunctionComponent } from "react";
import clsx from "clsx";
import Link from "next/link";

interface TextProps {
  html: string;
  className?: string;
}

export const CategoryDetail: FC<{
  categoryItem: {
    description: string;
    name: string;
  };
}> = ({ categoryItem }) => {
  if (!categoryItem) return null;

  return (
    <div className="px-4 w-full max-w-screen-2xl mt-8 md:mt-14 mx-auto mb-10">
      <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-20 items-start">
        <div className=" flex-col gap-3 shrink-0">
          <Link href="/" className="hidden lg:flex w-fit text-sm font-medium text-nowrap relative text-neutral-500 before:absolute before:bottom-0 before:left-0 before:h-px before:w-0 before:bg-current before:transition-all before:duration-300 before:content-[''] hover:text-black hover:before:w-full dark:text-neutral-400 dark:hover:text-neutral-300">
            Home /
          </Link>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-black dark:text-white capitalize">
            {categoryItem.name}
          </h1>
        </div>

        <div className="w-full md:max-w-2xl lg:max-w-3xl">
          {categoryItem.description && (
            <Prose
              className="w-full text-base text-gray-600 dark:text-gray-300"
              html={categoryItem.description}
            />
          )}
        </div>
      </div>
    </div>
  );
};


const Prose: FunctionComponent<TextProps> = ({ html, className }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html as string }}
      className={clsx(
        "prose prose-h1:text-[24px]",
        className
      )}

    />
  );
};
export default Prose;