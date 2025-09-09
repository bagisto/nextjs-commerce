"use client";

import Prose from "@/components/prose";
import { FC } from "react";

const CategoryDetail: FC<{
  categoryItem: {
    description: string;
  };
}> = ({ categoryItem }) => {
  if (!categoryItem || typeof categoryItem.description !== "string")
    return null;
  return (
    <>
      <Prose
        className="mx-auto mt-7.5 w-full max-w-screen-2xl"
        html={categoryItem.description}
      />
      <style jsx>{`
        :global(.prose h1) {
          font-size: 36px;
          font-weight: bold;
          margin: 12px 0px;
          font-family: "Outfit", sans-serif;
        }
      `}</style>
    </>
  );
};

export default CategoryDetail;
