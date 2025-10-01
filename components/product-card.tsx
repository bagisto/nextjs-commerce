import Link from "next/link";
import { FC } from "react";
import Grid from "./grid";
import { GridTileImage } from "./grid/tile";
import Price from "./price";
import AddToCartButton from "./add-to-cart-button";
import { NOT_IMAGE } from "@/lib/constants";

export const ProductCard: FC<{
  currency: string;
  price: string;
  imageUrl: string;
  product: {
    urlKey: string;
    name: string;
    id: string;
    type: string;
  };
}> = ({ currency, price, imageUrl, product }) => {
  return (
    <Grid.Item
      key={product.urlKey}
      className="animate-fadeIn gap-y-4.5 flex flex-col"
    >
      <div className="group relative overflow-hidden rounded-lg">
        <Link href={`/product/${product.urlKey}?type=${product.type}`}>
          <div className="aspect-[353/283] h-auto truncate rounded-lg">
            <GridTileImage
              alt={product?.name || "Product image"}
              blurDataURL={NOT_IMAGE}
              className={`rounded-lg bg-neutral-100 object-cover transition duration-300 ease-in-out group-hover:scale-105`}
              placeholder="blur"
              loading="lazy"
              priority={false}
              fill
              src={imageUrl ?? NOT_IMAGE}
            />
          </div>
        </Link>
        
        <div
          className={`absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-x-4 rounded-full border-[1.5px] border-white bg-white/70 px-4 py-1.5 text-xs font-semibold text-black opacity-0 shadow-2xl backdrop-blur-md duration-300 group-hover:opacity-100 dark:text-white`}
        >
          <AddToCartButton
            productType={product.type}
            urlKey={product.urlKey}
            productId={product.id}
          />
        </div>
      </div>
      
      <div>
        <h2 className="mb-2.5 text-base font-medium md:text-lg">
          {product?.name}
        </h2>
        <Price
          amount={price}
          className="text-xs font-semibold md:text-sm"
          currencyCode={currency}
        />
      </div>
    </Grid.Item>
  );
};
