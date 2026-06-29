import { GET_RELATED_PRODUCTS } from "@/graphql";
import { SingleProductResponse } from "@/components/catalog/type";
import { cachedProductRequest } from "@/lib/cached-graphql";
import Link from "next/link";
import { NextImage } from "@/components/common/NextImage";
import { Price } from "@/components/theme/ui/Price";
import ProductCardActions from "@/components/catalog/product/ProductCardActions";
import { WishlistToggle } from "@/components/catalog/product/WishlistToggle";
import { CompareToggle } from "@/components/catalog/product/CompareToggle";
import { baseUrl, getImageUrl, NOT_IMAGE } from "@/utils/constants";

export async function RelatedProductsSection({
  fullPath,
}: {
  fullPath: string;
}) {
    async function getRelatedProduct(urlKey: string) {
      try {
        const dataById = await cachedProductRequest<SingleProductResponse>(
          urlKey,
          GET_RELATED_PRODUCTS,
          {
            urlKey: urlKey,
            first: 4,
          }
        );
    
        return dataById?.product || null;
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching product:", {
            message: error.message,
            urlKey,
            graphQLErrors: (error as unknown as Record<string, unknown>)
              .graphQLErrors,
          });
        }
        return null;
      }
    }

    const fetchRelatedProducts = await getRelatedProduct(fullPath);

    const relatedProducts = (fetchRelatedProducts?.relatedProducts != null ) && fetchRelatedProducts?.relatedProducts?.edges
    ? fetchRelatedProducts.relatedProducts.edges.map((e) => e.node)
    : [];

  if (!relatedProducts.length) return null;

  return (
    <div className="w-full max-w-[1550px] mx-auto px-4 mt-20 flex flex-col gap-y-10 lg:h-[493px]">
      <div className="flex flex-col gap-y-4 text-center lg:text-left items-center lg:items-start font-outfit">
        <h2 className="font-semibold text-4xl leading-none text-black dark:text-white">
          New Products
        </h2>
        <p className="text-base font-normal leading-relaxed text-black/60 dark:text-selected-white max-w-[800px]">
          Discover the latest trends! Fresh products just added—shop new styles, tech, and essentials before they&apos;re gone.
        </p>
      </div>

      <div className="w-full lg:h-[352px] grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row lg:justify-start gap-6">
        {relatedProducts.map((item, index) => {
          const imageUrl = getImageUrl(item?.baseImageUrl, baseUrl, NOT_IMAGE);
          const ProductPrice =
            item?.type === "configurable" || item?.type === "grouped" || item?.type === "bundle"
              ? item?.minimumPrice ?? "0"
              : item?.price ?? "0";
          return (
            <div key={item.id ?? index} className="w-full lg:w-[353px] flex flex-col">
              <div className="group relative overflow-hidden rounded-2xl w-full aspect-[353/283] lg:h-[283px]">
                <Link href={`/product/${item.urlKey}`} aria-label={`View ${item.name}`}>
                  <div className="w-full h-full truncate rounded-2xl">
                    <NextImage
                      alt={item?.name || "Product image"}
                      src={imageUrl || ""}
                      width={353}
                      height={283}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="rounded-2xl bg-neutral-100 object-cover transition duration-300 ease-in-out group-hover:scale-105 w-full h-full"
                    />
                  </div>
                </Link>

               
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <WishlistToggle productId={item.id} />
                    <CompareToggle productId={item.id} />
                </div>

                <div className="absolute bottom-[10px] lg:bottom-[16px] left-1/2 -translate-x-1/2 z-10 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ProductCardActions
                    productType={item.type}
                    productId={item.id}
                    productUrlKey={item.urlKey || item.sku}
                    isSaleable={item.isSaleable}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-y-[10px] w-full lg:h-[51px] mt-[18px]">
                <h3 className="font-outfit font-medium text-lg leading-none text-black dark:text-white truncate">
                  {item?.name}
                </h3>
                <div className="flex items-center gap-2">
                  {(item?.type === "configurable" || item?.type === "grouped") && !item?.specialPrice && (
                    <span className="font-outfit text-xs text-gray-600 dark:text-gray-400 mr-1.5">
                      {item?.type === "configurable" ? "As low as" : "Starting at"}
                    </span>
                  )}
                  {item?.specialPrice ? (
                    <div className="flex items-center gap-2">
                      <Price
                        amount={String(ProductPrice)}
                        className="font-outfit text-xs font-medium text-selected-black line-through decoration-neutral-500 decoration-2"
                        currencyCode="USD"
                      />
                      <Price
                        amount={String(item.specialPrice)}
                        className="font-outfit text-lg font-medium leading-none text-black dark:text-white"
                        currencyCode="USD"
                      />
                    </div>
                  ) : (
                    <Price
                      amount={String(ProductPrice)}
                      className="font-outfit text-lg font-medium leading-none text-black dark:text-white"
                      currencyCode="USD"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}