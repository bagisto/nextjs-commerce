import { baseUrl, getImageUrl, NOT_IMAGE } from "@/utils/constants";
import { resolveCardPrice } from "@/utils/helper";
import { ProductCard } from "./ProductCard";
import { ProductNode } from "../type";

export default function ProductGridItems({
  products,
  backUrl,
}: {
  products: ProductNode[];
  backUrl?: string;
}) {
  return products.map((product, index) => {
    const imageUrl = getImageUrl(product?.baseImageUrl, baseUrl, NOT_IMAGE);
    const price = resolveCardPrice(product);
    const currency = product?.priceHtml?.currencyCode ?? "USD";
    return (
      <ProductCard
        key={product?.id ?? index}
        currency={currency}
        imageUrl={imageUrl || ""}
        price={String(price)}
        specialPrice={
          product?.minimumPrice ? String(product.minimumPrice) : undefined
        }
        product={{
          urlKey: product.urlKey || product.sku,
          name: product?.name || product.sku,
          id: product.id,
          type: product.type,
          isSaleable: product?.isSaleable,
        }}
        priority={index < 4}
        backUrl={backUrl}
      />
    );
  });
}
