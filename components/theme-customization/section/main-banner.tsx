import Link from "next/link";
import { FC } from "react";
import { GridTileImage } from "@/components/grid/tile";
import { TranslationsTypes } from "@/lib/bagisto/types";
import { NOT_IMAGE } from "@/lib/constants";
import { isArray } from "@/lib/type-guards";
import Image from "next/image";

const MainBanner: FC<{
  data: TranslationsTypes[];
}> = ({ data }) => {
  if (!isArray(data)) return null;

  return (
    <section className="mt-7 grid gap-7 overflow-hidden">
      {data?.flatMap(({ options }) => {
        const { images } = options;
        if (!Array.isArray(images) || images.length === 0) return [];

        const firstImage = images[0];

        return (
          <div key={firstImage?.imageUrl}>
            <Link
              className="relative flex aspect-[1.98] h-auto w-auto overflow-hidden rounded-2xl"
              href={firstImage?.link as string}
              target="_blank"
            >
              <Image
                src={firstImage?.imageUrl ?? NOT_IMAGE}
                alt={firstImage?.image || "Images"}
                fill
                className="w-full overflow-hidden rounded-lg object-fill"
                priority={true}
                fetchPriority="high"
              />
            </Link>
          </div>
        );
      })}
    </section>
  );
};

export default MainBanner;
