import { baseUrl, getImageUrl, NOT_IMAGE } from "@/utils/constants";
import { ProductCard } from "./ProductCard";

export default function ProductGridItems({
  products,
}: {
  products: any;
}) {
  return products.map((product: any, index: number) => {

const imageUrl = getImageUrl(product?.baseImageUrl, baseUrl, NOT_IMAGE);

    const price = 
  product?.type === "configurable"
    ? product?.minimumPrice ?? "0"
    : product?.price ?? "0";
  // const price = product?.minimumPrice ?? "0";
    const currency = product?.priceHtml?.currencyCode;
    return (
      <ProductCard
        key={index}
        currency={currency}
        imageUrl={imageUrl || ""}
        price={price}
        specialPrice={product?.minimumPrice}
        product={product}
      />
    );
  });
}
