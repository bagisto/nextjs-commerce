
import { NOT_IMAGE } from "@/utils/constants";
import Grid from "../../theme/ui/grid/Grid";
import { baseUrl, getImageUrl } from "@/utils/constants";
import { ProductCard } from "./ProductCard";
import { ProductsSectionProps } from "../type";


export function ProductsSection({ title, description, products }: ProductsSectionProps) {
  if (!products?.length) return null;

  return (
    <div className="flex flex-col gap-y-10 pt-8 sm:pt-12 lg:pt-20 w-full max-w-screen-2xl mx-auto px-[15px]  xss:px-7.5">
      <div className="flex flex-col gap-y-4 font-outfit text-center">
        <h2 className="text-2xl sm:text-4xl font-semibold">{title}</h2>
        <p className="text-base font-normal text-black/60 dark:text-neutral-300">{description}</p>
      </div>

      <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item, index) => {
         const imageUrl = getImageUrl(item?.baseImageUrl, baseUrl, NOT_IMAGE);
          const ProductPrice =
            item?.type === "configurable"
              ? item?.minimumPrice ?? "0"
              : item?.price ?? "0";
          return (
            <ProductCard
              key={item.id ?? index}
              currency="USD"
              imageUrl={imageUrl || ""}
              price={String(ProductPrice)}
              product={{
                urlKey: item.urlKey || item.sku,
                name: item?.name || item.sku,
                id: item.id,
                type: item.type,
              }} specialPrice={""}            />
          );
        })}
      </Grid>
    </div>
  );
}

