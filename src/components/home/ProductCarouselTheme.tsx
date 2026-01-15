import { ProductCard } from "@components/catalog/product/ProductCard";
import { ProductsSectionProps } from "@components/catalog/type";
import { baseUrl, getImageUrl, NOT_IMAGE } from "@utils/constants";


const Theme = ({ title, description, products }: ProductsSectionProps) => {
  return (
    <section className="pt-8 sm:pt-12 lg:pt-20">
      <div className="md:max-w-4.5xl mx-auto mb-6 w-full px-0 text-center xss:mb-10 md:px-36">
        <h2 className="mb-2 text-[28px] font-semibold text-black dark:text-white xss:mb-4 xss:text-4xl">
          {title}
        </h2>
        <p className="font-normal text-black/60 dark:text-neutral-300 text-lg">
          {description}
        </p>
      </div>

      <div className="w-full pb-6 pt-1">
        <ul className="m-0 grid grid-cols-2 justify-center gap-5 md:gap-11.5 p-0 xss:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
        </ul>
      </div>
    </section>
  );
};

export default Theme;
