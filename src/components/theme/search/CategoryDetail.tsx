import { FC } from "react";
import type { FunctionComponent } from "react";
import clsx from "clsx";

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
  if (!categoryItem || typeof categoryItem.description !== "string")
    return null;
  return (
    <>
    <div className="px-4 w-full max-w-screen-2xl mt-7.5 mx-auto">
     <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{categoryItem.name}</h1>
      <Prose
        className="mx-auto w-full max-w-screen-2xl"
        html={categoryItem.description}
      />
    </div>
    </>
  );
}


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