import { GET_PRODUCT_REVIEWS } from "@/graphql";
import { cachedProductRequest } from "@/lib/cached-graphql";



export async function getProductReviews(productId: string) {
  try {
    const variables = { product_id: Number(productId), first: 10 };
    
    const response = await cachedProductRequest<any>(
      productId,
      GET_PRODUCT_REVIEWS,
      variables
    );
    
    return response?.productReviews?.edges || [];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching product reviews:", {
        message: error.message,
        productId,
        graphQLErrors: (error as unknown as Record<string, unknown>)
          .graphQLErrors,
      });
    }
    return [];
  }
}
