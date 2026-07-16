import { GET_PRODUCT_SWATCH_REVIEW } from "@/graphql";
import { cachedProductRequest } from "@/lib/cached-graphql";
import { ProductSwatchReview } from "@/types/category/type";


export async function getProductWithSwatchAndReview(urlKey: string) {
  try {
    const dataById = await cachedProductRequest<{ product: ProductSwatchReview }>(
      urlKey,
      GET_PRODUCT_SWATCH_REVIEW,
      { urlKey: urlKey }
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