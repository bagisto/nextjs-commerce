
import { getAverageRating } from "@utils/helper";
import { ProductData } from "../type";
import { ProductDescription } from "./ProductDescription";
import { getProductWithSwatchAndReview } from "@/utils/hooks/getProductSwatchAndReview";
import { ProductReview } from "@/types/category/type";
import { getProductReviews } from "@utils/hooks/getProductReviews";

export default async function ProductInfo({
  product,
  slug,
  reviews,
}: {
  product: ProductData;
  slug: string;
  reviews: ProductReview[];
}) {
  const productSwatchReview = await getProductWithSwatchAndReview(slug);
  const getAllreviews = await getProductReviews(product?.id?.split("/").pop() || '')

  return (
    <ProductDescription
      product={product}
      productSwatchReview={productSwatchReview}
      slug={slug}
      reviews={getAllreviews}
      totalReview={reviews.length}
      avgRating = {getAverageRating(reviews)}
    />
  );
}
