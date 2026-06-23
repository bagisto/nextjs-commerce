import { FC } from "react";
import type { FunctionComponent } from "react";
import clsx from "clsx";
import Breadcrumb from "@components/common/Breadcrumb";

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
    <div className="px-4 w-full max-w-screen-2xl mt-8 md:mt-14 mx-auto mb-0 sm:mb-10">
      <div className="flex flex-col lg:flex-row justify-between gap-4 md:gap-8 lg:gap-20 items-start">
        <div className=" flex-col gap-3 shrink-0">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: categoryItem.name }]} />
          <h1 className="mt-2 text-xl md:text-4xl font-bold tracking-tight text-black dark:text-white capitalize">
            {categoryItem.name}
          </h1>
        </div>

        <div className="w-full md:max-w-2xl lg:max-w-3xl">
          {categoryItem.description && (
            <Prose
              className="w-full text-lg text-gray-600 dark:text-gray-300"
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
        "prose prose-h1:text-2xl",
        className
      )}

    />
  );
};
export default Prose;