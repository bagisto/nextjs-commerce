import { SingleProductResponse } from "@/app/(public)/product/[...urlProduct]/page";
import { GET_PRODUCT_SWATCH_REVIEW, graphqlRequest } from "@/graphql";


export async function getProductWithSwatchAndReview(productIdentifier: string) {
  try {
    const dataById = await graphqlRequest<SingleProductResponse>(
      GET_PRODUCT_SWATCH_REVIEW,
      {
        id: productIdentifier,
      },
      {
        tags: ["swatch-and-reviews", `product-${productIdentifier}`],
        life: "hours",
      }
    );

    return dataById?.product || null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching product:", {
        message: error.message,
        productIdentifier,
        graphQLErrors: (error as unknown as Record<string, unknown>)
          .graphQLErrors,
      });
    }
    return null;
  }
}