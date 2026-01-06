import { FC } from "react";
import ImageCarousel from "./ImageCarousel";
import ProductCarousel from "./ProductCarousel";
import CategoryCarousel from "./CategoryCarousel";

interface RenderThemeCustomizationProps {
    themeCustomizations: {
        edges: {
            node: {
                id: string;
                type: string;
                name: string;
                translations: {
                    edges: {
                        node: {
                            locale: string;
                            options: string;
                        };
                    }[];
                };
            };
        }[];
    };
}

const RenderThemeCustomization: FC<RenderThemeCustomizationProps> = ({ themeCustomizations }) => {
    if (!themeCustomizations?.edges?.length) return null;

    let productCarouselIndex = 0;

    return (
        <section className="flex w-full max-w-screen-2xl mx-auto flex-col gap-y-10 pb-4 md:gap-y-20 px-[15px] xss:px-7.5">
            {themeCustomizations.edges.map(({ node }) => {
                const translation = node.translations.edges.find(e => e.node.locale === 'en') || node.translations.edges[0];

                if (!translation) return null;

                let options = {};
                try {
                    options = JSON.parse(translation.node.options);
                } catch (e) {
                    console.error("Error parsing options for", node.type, e);
                    return null;
                }

                switch (node.type) {
                    case "image_carousel":
                        return <ImageCarousel key={node.id} options={options as any} />;
                    case "product_carousel": {
                        productCarouselIndex++;
                        const opts = options as any;
                        const limit = opts?.filters?.limit ? parseInt(opts.filters.limit, 10) : null;
                        const itemCount = limit || (productCarouselIndex === 1 ? 3 : 4);

                        return <ProductCarousel key={node.id} options={{ ...options, title: node.name } as any} itemCount={itemCount} />;
                    }
                    case "category_carousel":
                        return <CategoryCarousel key={node.id} options={options as any} />;
                    default:
                        return null;
                }
            })}
        </section>
    );
};

export default RenderThemeCustomization;
