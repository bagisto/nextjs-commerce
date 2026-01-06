import { SingleProductResponse } from "@/app/(public)/product/[...urlProduct]/page";
import { GET_PRODUCT_SWATCH_REVIEW, graphqlRequest } from "@/graphql";


export async function getProductWithSwatchAndReview(urlKey: string) {
  try {
    const dataById = await graphqlRequest<SingleProductResponse>(
      GET_PRODUCT_SWATCH_REVIEW,
      {
        urlKey: urlKey,
      },
      {
        tags: ["swatch-and-reviews", `product-${urlKey}`],
        life: "hours",
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