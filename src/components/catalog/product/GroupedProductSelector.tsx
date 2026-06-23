"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Price } from "@/components/theme/ui/Price";
import { safeCurrencyCode } from "@/utils/helper";

interface GroupedProductSelectorProps {
    groupedProducts: any;
    quantities: Record<string, number>;
    onQuantityChange: (productId: string, quantity: number) => void;
}

export function GroupedProductSelector({
    groupedProducts,
    quantities,
    onQuantityChange,
}: GroupedProductSelectorProps) {
    if (!groupedProducts?.edges?.length) return null;

    return (
        <div className="flex flex-col gap-y-4 my-6">
            {groupedProducts.edges.map(({ node }: any) => {
                const product = node.associatedProduct;
                const productId = product.id.split("/").pop();
                const currentQty = quantities[productId] ?? node.qty ?? 0;

                return (
                    <div key={product.id} className="flex items-center justify-between gap-4 p-2 pb-4 flex-wrap">
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap gap-x-1.5 items-center font-outfit text-base font-normal leading-5 text-selected-black dark:text-selected-white">
                                <span>{product.name}</span>
                                <span>+</span>
                                <Price
                                    amount={product.price}
                                    currencyCode={safeCurrencyCode(product)}
                                    className="font-outfit text-base font-normal leading-5 text-selected-black dark:text-selected-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center rounded-full border-2 border-primary dark:border-primary-soft">
                            <button
                                type="button"
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-full text-gray-600 transition-colors hover:text-gray-800 dark:text-white"
                                onClick={() => onQuantityChange(productId, Math.max(0, currentQty - 1))}
                            >
                                <MinusIcon className="h-4 w-4" />
                            </button>

                            <input
                                type="number"
                                min={0}
                                max={100}
                                inputMode="numeric"
                                aria-label={`Quantity for ${product.name}`}
                                value={currentQty}
                                onChange={(e) => {
                                    const value = Math.min(100, Math.max(0, Math.floor(Number(e.target.value) || 0)));
                                    onQuantityChange(productId, value);
                                }}
                                className="flex h-10 min-w-[3rem] w-12 bg-transparent text-center outline-none appearance-none px-1 font-medium text-gray-800 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                            />

                            <button
                                type="button"
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-full text-gray-600 transition-colors hover:text-gray-800 dark:text-white"
                                onClick={() => onQuantityChange(productId, Math.min(100, currentQty + 1))}
                            >
                                <PlusIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
