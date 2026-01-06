import { FC } from "react";
import { graphqlRequest } from "../../lib/graphql-fetch";
import { GET_PRODUCTS } from "@/graphql/catelog/queries/Product";
import { ThreeItemGrid } from "./ThreeItemGrid";
import Theme from "./ProductCarouselTheme";

interface ProductCarouselProps {
    options: {
        title?: string;
        filters: Record<string, any>;
    };
    itemCount?: number;
}

const ProductCarousel: FC<ProductCarouselProps> = async ({ options, itemCount = 4 }) => {
    const { filters, title } = options;

    try {
        const variables: any = {
            first: filters?.limit ? parseInt(filters.limit, 10) : itemCount,
        };

        variables.sortKey = "CREATED_AT";
        variables.reverse = true;

        if (filters?.sort) {
            const sortParts = filters.sort.split('-');
            if (sortParts.length === 2) {
                const keyMap: Record<string, string> = {
                    "created_at": "CREATED_AT",
                    "price": "PRICE",
                    "name": "NAME",
                };

                const rawKey = sortParts[0].toLowerCase();
                variables.sortKey = keyMap[rawKey] || "CREATED_AT";
                variables.reverse = sortParts[1] === 'desc';
            }
        }

        const filterObject: Record<string, any> = {};

        if (filters?.new && (filters.new === "1" || filters.new === 1)) {
            filterObject.new = "1";
        }

        if (filters?.featured && (filters.featured === "1" || filters.featured === 1)) {
            filterObject.featured = "1";
        }

        if (Object.keys(filterObject).length > 0) {
            variables.filter = JSON.stringify(filterObject);
        }

        const data = await graphqlRequest<any>(
            GET_PRODUCTS,
            variables,
            {
                tags: ["products"],
                life: "days",
            }
        );

        const products =
            data?.products?.edges?.slice(0, 8).map((edge: any) => edge.node) || [];

        if (!products.length) {
            return null;
        }

        if (itemCount === 3) {
            return (
                <ThreeItemGrid
                    title={title || "Products"}
                    description="Discover the latest trends! Fresh products just added—shop new styles, tech, and essentials before they're gone."
                    products={products}
                />
            );
        }

        return (
          
            <Theme
                title={title || "Products"}
                description="Discover the latest trends! Fresh products just added—shop new styles, tech, and essentials before they're gone."
                products={products}
            />
        );
    } catch (error) {
        console.error("Error fetching products for carousel:", {
            title,
            filters,
            error: error instanceof Error ? error.message : error
        });
        return null;
    }
};

export default ProductCarousel;
