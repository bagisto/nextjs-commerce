import { FC } from "react";
import Link from "next/link";
import { GridTileImage } from "@/components/theme/ui/grid/Tile";

interface ThreeItemGridProps {
    title: string;
    description: string;
    products: Array<{
        id: string;
        name: string;
        urlKey: string;
        baseImageUrl: string;
        price: string | number;
        minimumPrice?: string | number;
        type: string;
    }>;
}

function ThreeItemGridItem({ product, size, priority }: {
    product: any;
    size: 'full' | 'half';
    priority?: boolean;
}) {
    return (
        <div
            className={
                size === 'full'
                    ? 'md:col-span-4 md:row-span-2'
                    : 'md:col-span-2 md:row-span-1'
            }
        >
            <Link
                className="relative block aspect-square h-full w-full"
                href={`/product/${product.urlKey}?type=${product.type}`}
            >
                <GridTileImage
                    src={product.baseImageUrl}
                    className="object-cover"
                    fill
                    sizes={
                        size === 'full'
                            ? '(min-width: 768px) 66vw, 100vw'
                            : '(min-width: 768px) 33vw, 100vw'
                    }
                    priority={priority}
                    alt={product.name}
                    label={{
                        position: size === 'full' ? 'center' : 'bottom',
                        title: product.name,
                        amount: product.type === 'configurable' ? (product.minimumPrice || '0') : (product.price || '0'),
                        currencyCode: 'USD',
                    }}
                />
            </Link>
        </div>
    );
}

export const ThreeItemGrid: FC<ThreeItemGridProps> = ({ title, description, products }) => {
    if (!products || products.length < 3) return null;

    const [firstProduct, secondProduct, thirdProduct] = products;

    return (
        <section className="pt-8 sm:pt-12 lg:pt-20">
            <div className="md:max-w-4.5xl mx-auto mb-10 w-auto px-0 text-center md:px-36">
                <h1 className="mb-4 font-outfit text-4xl font-semibold text-black dark:text-white">
                    {title}
                </h1>
                <p className="text-lg font-normal text-black/60 dark:text-neutral-300">
                    {description}
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
                <ThreeItemGridItem product={firstProduct} size="full" priority={true} />
                <ThreeItemGridItem product={secondProduct} size="half" priority={true} />
                <ThreeItemGridItem product={thirdProduct} size="half" />
            </div>
        </section>
    );
};

export default ThreeItemGrid;
