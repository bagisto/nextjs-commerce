import { FC } from "react";
import Prose from "./Prose";

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
    <div className="px-[15px] w-full max-w-screen-2xl mt-7.5 mx-auto">
     <h1 className="text-2xl sm:text-3xl font-bold">{categoryItem.name}</h1>
      <Prose
        className="mx-auto w-full max-w-screen-2xl"
        html={categoryItem.description}
      />
    </div>
    </>
  );
}
