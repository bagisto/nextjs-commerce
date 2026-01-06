import Link from "next/link";
import { FC } from "react";
import Grid from "@/components/theme/ui/grid/Grid";
import AddToCartButton from "@/components/theme/ui/AddToCartButton";
import { NextImage } from "@/components/common/NextImage";
import { Price } from "@/components/theme/ui/Price";

export const ProductCard: FC<{
  currency: string;
  price: string;
  specialPrice?: string;
  imageUrl: string;
  product: {
    urlKey: string;
    name: string;
    id: string;
    type: string;
  };
}> = ({ currency, price, specialPrice, imageUrl, product }) => {
  return (
    <Grid.Item
      key={product.id}
      className="animate-fadeIn gap-y-4.5 flex flex-col"
    >
      <div className="group relative overflow-hidden rounded-lg">
        <Link href={`/product${product.id}?type=${product?.type}`}>
          <div className="aspect-[353/283] h-auto truncate rounded-lg">
            <NextImage
              alt={product?.name || "Product image"}
              src={imageUrl}
              width={353}
              height={283}
              className={`rounded-lg bg-neutral-100 object-cover transition duration-300 ease-in-out group-hover:scale-105`}
            />
          </div>
        </Link>
        <div
          className={`hidden md:block absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-x-4 rounded-full border-[1.5px] border-white bg-white/70 px-4 py-1.5 text-xs font-semibold text-black opacity-0 shadow-2xl backdrop-blur-md duration-300 group-hover:opacity-100 dark:text-white`}
        >
          <AddToCartButton productType={product.type} productId={product.id} />
        </div>
        <div
          className={`block md:hidden absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-x-4 rounded-full border-[1.5px] border-white bg-white/70 px-4 py-1.5 text-xs font-semibold text-black opacity-100 shadow-2xl backdrop-blur-md duration-300 group-hover:opacity-100 dark:text-white`}
        >
          <AddToCartButton productType={product.type} productId={product.id} />
        </div>
      </div>

      <div>
        <h2 className="mb-2.5 text-base font-medium md:text-lg">
          {product?.name}
        </h2>

        <div className="flex items-center gap-2">
          {product?.type === "configurable" && (
            <span className="text-xs text-gray-600 dark:text-gray-400 md:text-sm">
              As low as
            </span>
          )}
          {product?.type === "simple" && specialPrice ? (
            <>
            <div className="flex items-center gap-2">
              {/* <Price
                amount={price}
                className="text-xs font-semibold text-gray-500 md:text-sm"
                currencyCode={currency}
                style={{ textDecoration: "line-through" }}
              /> */}
              <Price
                amount={specialPrice}
                className="text-xs font-semibold md:text-sm"
                currencyCode={currency}
              />
            </div>
            </>
          ) : (
            <Price
              amount={price}
              className="text-xs font-semibold md:text-sm"
              currencyCode={currency}
            />
          )}
        </div>
      </div>
    </Grid.Item>
  );
};
