import { FC, Suspense } from "react";
import { safeParse } from "@utils/helper";
import { CategoryCarouselOptions, ImageCarouselOptions, ProductCarouselOptions, ThemeCustomizationResponse } from "@/types/theme/theme-customization";
import ImageCarousel from "./ImageCarousel";
import ProductCarousel from "./ProductCarousel";
import CategoryCarousel from "./CategoryCarousel";
import { MobileSearchBar } from "@components/layout/navbar/MobileSearch";
import { CategoryCarouselSkeleton } from "@components/common/skeleton/CategoryCarouselSkeleton";
import { ThemeSkeleton } from "@components/common/skeleton/ThemeSkeleton";
import { ThreeItemGridSkeleton } from "@components/theme/ui/grid/ThreeItemsSkeleton";

type ImageCarouselComponentOptions = {
  images: {
    image: string;
    link: string;
    title?: string;
  }[];
};

interface RenderThemeCustomizationProps {
    themeCustomizations: ThemeCustomizationResponse['themeCustomizations'];
}

const RenderThemeCustomization: FC<RenderThemeCustomizationProps> = ({ themeCustomizations }) => {
    if (!themeCustomizations?.edges?.length) return null;

    let productCarouselIndex = 0;

    const sortedEdges = [...themeCustomizations.edges].sort((a, b) =>
        (a.node.sortOrder || 0) - (b.node.sortOrder || 0)
    );

    return (
        <>
            <MobileSearchBar />
            <section className="w-full max-w-screen-2xl mx-auto pb-4 px-4 xss:px-7.5">
                {sortedEdges.map(({ node }) => {
                    const translation = node.translations.edges.find(e => e.node.locale === 'en') || node.translations.edges[0];
                    if (!translation) return null;

                    const options =
                      safeParse<ImageCarouselOptions>(
                        translation.node.options
                      ) || ({} as ImageCarouselOptions);
                    if (Object.keys(options).length === 0) {
                        console.error("Error parsing options for", node.type);
                    }

                    switch (node.type) {
                        case "image_carousel":
                            return <ImageCarousel key={node.id} options={options as ImageCarouselComponentOptions} />;
                        case "product_carousel": {
                            productCarouselIndex++;
                            const opts = options as ProductCarouselOptions;
                            const limit = opts?.filters?.limit ? parseInt(String(opts.filters.limit), 10) : null;
                            const itemCount = limit || (productCarouselIndex === 1 ? 3 : 4);
                            const fallback = node.sortOrder === 2 ? <ThreeItemGridSkeleton /> : <ThemeSkeleton />;
                            return (
                                <Suspense key={node.id} fallback={fallback}>
                                    <ProductCarousel key={node.id} options={{ ...options, title: node.name } as ProductCarouselOptions} itemCount={itemCount} sortOrder={node?.sortOrder} />
                                </Suspense>
                            );
                        }
                        case "category_carousel":
                            return (
                                <Suspense key={node.id} fallback={<CategoryCarouselSkeleton />}>
                                    <CategoryCarousel options={options as CategoryCarouselOptions} />
                                </Suspense>
                            );
                        default:
                            return null;
                    }
                })}
            </section>
        </>
    );
};

export default RenderThemeCustomization;
