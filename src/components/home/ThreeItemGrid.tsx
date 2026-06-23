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

interface ProductItem {
    id: string;
    name: string;
    urlKey: string;
    baseImageUrl: string;
    price: string | number;
    minimumPrice?: string | number;
    type: string;
}

function ThreeItemGridItem({ product, size, priority }: {
    product: ProductItem;
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
                className="relative block h-full w-full"
                href={`/product/${product.urlKey}`}
                aria-label={`${product?.name}`}
                style={{
                    aspectRatio: size === 'full' ? '1018 / 800' : '502 / 393'
                }}
            >
                <GridTileImage
                    src={product.baseImageUrl}
                    className="object-cover "
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
                        amount: String(product.type === 'configurable' || product.type === 'grouped' || product.type === 'bundle' ? (product.minimumPrice || '0') : (product.price || '0')),
                        currencyCode: 'USD',
                    }}
                />
            </Link>
        </div>
    );
}


function MobileThreeItemGridItem({ product, priority }: {
    product: ProductItem;
    priority?: boolean;
}) {
    return (
        <div className="col-span-1">
            <Link
                className="relative block h-full w-full aspect-[380/280]"
                href={`/product/${product.urlKey}`}
                aria-label={`${product?.name}`}
            >
                <GridTileImage
                    src={product.baseImageUrl}
                    className="object-cover"
                    fill
                    priority={priority}
                    alt={product.name}
                    label={{
                        position: 'center',
                        title: product.name,
                        amount: String(product.type === 'configurable' || product.type === 'grouped' || product.type === 'bundle' ? (product.minimumPrice || '0') : (product.price || '0')),
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
        <section className="pt-6 sm:pt-12 lg:pt-20">
            <div className="md:max-w-4.5xl mx-auto mb-10 w-auto px-0 text-center md:px-36">
                <h1 className="mb-4 font-outfit text-xl md:text-4xl font-semibold text-black dark:text-white">
                    {title}
                </h1>
                <p className="text-sm md:text-lg font-normal text-selected-black dark:text-selected-white">
                    {description}
                </p>
            </div>

            <div className="hidden lg:grid gap-4 lg:grid-cols-6 lg:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
                <ThreeItemGridItem product={firstProduct} size="full" priority={true} />
                <ThreeItemGridItem product={secondProduct} size="half" priority={true} />
                <ThreeItemGridItem product={thirdProduct} size="half" />
            </div>

            <div className="grid lg:hidden gap-4 grid-cols-1">
                <MobileThreeItemGridItem product={firstProduct} priority={true} />
                <MobileThreeItemGridItem product={secondProduct} priority={true} />
                <MobileThreeItemGridItem product={thirdProduct} />
            </div>
        </section>
    );
};

export default ThreeItemGrid;
