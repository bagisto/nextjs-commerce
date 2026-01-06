import clsx from "clsx";
import Link from "next/link";

import { NOT_IMAGE } from "@/utils/constants";
import { ProductDetailsInfo } from "@/types/types";
import { GridTileImage } from "./Tile";
export default function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: ProductDetailsInfo;
  size: "full" | "half";
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.urlKey}?type=${item.type}`}
      >
        <GridTileImage
          fill
          alt={item?.name || "Images"}
          className={clsx(
            "relative h-full w-full object-cover",
            "transition duration-300 ease-in-out group-hover:scale-105"
          )}
          label={{
            position: size === "full" ? "left" : "center",
            title: item?.name as string,
            amount:
              item.priceHtml?.finalPrice || item.priceHtml?.regularPrice || "0",
            currencyCode: item.priceHtml?.currencyCode,
          }}
          priority={priority}
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          src={
            item?.cacheGalleryImages?.[0]?.originalImageUrl ??
            item?.images?.[0]?.url ??
            NOT_IMAGE
          }
        />
      </Link>
    </div>
  );
}
