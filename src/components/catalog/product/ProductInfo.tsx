
import { ProductData, ProductReviewNode } from "../type";
import { ProductDescription } from "./ProductDescription";
import { getProductWithSwatchAndReview } from "@/utils/hooks/getProductSwatchAndReview";

export default async function ProductInfo({
  product,
  slug,
  reviews,
  totalReview,
}: {
  product: ProductData;
  slug: string;
  reviews: ProductReviewNode[];
  totalReview: number;
}) {

  const productSwatchReview = await getProductWithSwatchAndReview(slug);

  return (
    <ProductDescription
      product={product}
      productSwatchReview={productSwatchReview}
      slug={slug}
      reviews={reviews}
      totalReview={totalReview}
    />
  );
}
