"use client"

import { FC } from "react";
import Link from "next/link";
import { GridTileImage } from "@/components/theme/ui/grid/Tile";
import { useMediaQuery } from "@utils/hooks/useMediaQueryHook";

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
                        amount: product.type === 'configurable' ? (product.minimumPrice || '0') : (product.price || '0'),
                        currencyCode: 'USD',
                    }}
                />
            </Link>
        </div>
    );
}


function MobileThreeItemGridItem({ product, size, priority }: {
    product: any;
    size: 'full' | 'half';
    priority?: boolean;
}) {

    return (
        <div
            className={
                size === 'full' ? 'col-span-1 xs:col-span-2 order-2' : 'col-span-1'
            }
        >
            <Link
                className="relative block h-full w-full"
                href={`/product/${product.urlKey}`}
                aria-label={`${product?.name}`}
                style={{
                    aspectRatio: size === 'full' ? '380 / 280' : '182 / 280'
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <section className="pt-8 sm:pt-12 lg:pt-20">
            <div className="md:max-w-4.5xl mx-auto mb-10 w-auto px-0 text-center md:px-36">
                <h1 className="mb-4 font-outfit text-xl md:text-4xl font-semibold text-black dark:text-white">
                    {title}
                </h1>
                <p className="text-sm md:text-base font-normal text-black/60 dark:text-neutral-300">
                    {description}
                </p>
            </div>
            {
                isDesktop ?
                    <div className="grid gap-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
                        <ThreeItemGridItem product={firstProduct} size="full" priority={true} />
                        <ThreeItemGridItem product={secondProduct} size="half" priority={true} />
                        <ThreeItemGridItem product={thirdProduct} size="half" />
                    </div>
                    :
                    (
                        <div className="grid  gap-4 grid-cols-1 xs:grid-cols-2 lg:max-h-[calc(100vh-200px)]">
                            <MobileThreeItemGridItem product={firstProduct} size="full" priority={true} />
                            <MobileThreeItemGridItem product={secondProduct} size="half" priority={true} />
                            <MobileThreeItemGridItem product={thirdProduct} size="half" />
                        </div>
                    )}
        </section>
    );
};

export default ThreeItemGrid;
