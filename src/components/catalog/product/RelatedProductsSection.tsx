import { GET_RELATED_PRODUCTS, graphqlRequest } from "@/graphql";
import { ProductsSection } from "./ProductsSection";
import { SingleProductResponse } from "@/app/(public)/product/[...urlProduct]/page";

export async function RelatedProductsSection({
  fullPath,
}: {
  fullPath: string;
}) {
    async function getRelatedProduct(productIdentifier: string) {
      try {
        const dataById = await graphqlRequest<SingleProductResponse>(
          GET_RELATED_PRODUCTS,
          {
            id: productIdentifier,
            first: 4,
          },
          {
            tags: ["related-products", `product-${productIdentifier}`],
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

    const fetchRelatedProducts = await getRelatedProduct(fullPath);

    const relatedProducts = (fetchRelatedProducts?.relatedProducts != null ) && fetchRelatedProducts?.relatedProducts?.edges
    ? fetchRelatedProducts.relatedProducts.edges.map((e : any) => e.node)
    : [];
  return (
    <ProductsSection
      title="Related Products"
      description="Discover the latest trends! Fresh products just added—shop new styles, tech, and essentials before they're gone."
      products={relatedProducts}
    />
  );
}