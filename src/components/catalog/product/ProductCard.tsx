import Link from "next/link";
import { FC } from "react";
import Grid from "@/components/theme/ui/grid/Grid";
import ProductCardActions from "@/components/catalog/product/ProductCardActions";
import { NextImage } from "@/components/common/NextImage";
import { Price } from "@/components/theme/ui/Price";

type ProductCardProps = {
  currency: string;
  price: string;
  specialPrice?: string;
  imageUrl: string;
  product: {
    urlKey: string;
    name: string;
    id: string;
    type: string;
    isSaleable?: string;
  };
  sizes?: string;
  priority?: boolean;
  backUrl?: string;
};

export const ProductCard: FC<ProductCardProps> = ({
  currency,
  price,
  specialPrice,
  imageUrl,
  product,
  sizes = "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw",
  priority = false,
  backUrl
}) => {
  return (
    <Grid.Item
      key={product.id}
      className="animate-fadeIn gap-y-4.5 flex flex-col"
    >
      <div className="group relative overflow-hidden rounded-lg">
        <Link 
          href={backUrl ? `/product/${product.urlKey}?backUrl=${encodeURIComponent(backUrl)}` : `/product/${product.urlKey}`} 
          aria-label={`View ${product.name}`}
        >
          <div className="aspect-[353/283] h-auto truncate rounded-lg">
            <NextImage
              alt={product?.name || "Product image"}
              src={imageUrl}
              width={353}
              height={283}
              sizes={sizes}
              className={`rounded-lg bg-neutral-100 object-cover transition duration-300 ease-in-out group-hover:scale-105`}
              priority={priority}
            />
          </div>
        </Link>

        <div
          className="absolute bottom-[10px] lg:bottom-[16px] left-1/2 -translate-x-1/2 z-10 w-[calc(100%-20px)] max-w-[112px] lg:max-w-[160px] h-8 lg:h-14 flex items-center justify-center rounded-4xl lg:rounded-full border-[0.52px] lg:border-[1.02px] border-white bg-white/80 lg:bg-overlay-light shadow-lg lg:shadow-2xl backdrop-blur-none lg:backdrop-blur-[12.28px] px-4 lg:px-6 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ProductCardActions productType={product.type} productId={product.id} productUrlKey={product.urlKey} isSaleable={product?.isSaleable} backUrl={backUrl} />
        </div>
      </div>

      <div>
        <h3 className="mb-2 md:mb-2.5 text-md font-medium md:text-lg">
          {product?.name}
        </h3>

        <div className="flex items-center gap-2">
          {(product?.type === "configurable" || product?.type === "grouped") && !specialPrice && (
            <span className="text-xs text-gray-600 dark:text-gray-400 md:text-sm">
              {product?.type === "configurable" ? "As low as" : "Starting at"}
            </span>
          )}
          {specialPrice ? (
            <div className="flex items-center gap-2">
              <Price
                amount={specialPrice}
                className="text-sm font-semibold"
                currencyCode={currency}
              />
              <Price
                amount={price}
                className="text-xs font-medium text-selected-black dark:text-selected-white md:text-sm"
                style={{ textDecoration: 'line-through', textDecorationColor: '#8a8787ff', textDecorationThickness: '2px' }}
                currencyCode={currency}
              />
            </div>
          ) : (
            <Price
              amount={price}
              className="text-sm font-semibold"
              currencyCode={currency}
            />
          )}
        </div>
      </div>
    </Grid.Item>
  );
};
