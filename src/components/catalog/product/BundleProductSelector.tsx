"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Price } from "@/components/theme/ui/Price";

interface BundleProductSelectorProps {
    bundleOptions: any;
    onSelectionChange: (bundleOptions: any, bundleOptionQty: any, totalPrice: number) => void;
    basePrice: number;
    currencyCode: string;
}

export function BundleProductSelector({
    bundleOptions,
    onSelectionChange,
    basePrice,
    currencyCode,
}: BundleProductSelectorProps) {
    const getInitialState = useCallback(() => {
        const initialSelections: Record<string, string[]> = {};
        const initialQuantities: Record<string, number> = {};

        bundleOptions?.edges?.forEach(({ node: option }: any) => {
            const optionId = option.id.split("/").pop();
            const defaultProducts = option.bundleOptionProducts.edges
                .filter(({ node }: any) => node.isDefault)
                .map(({ node }: any) => node.id.split("/").pop());

            if (defaultProducts.length > 0) {
                initialSelections[optionId] = defaultProducts;
            } else if (option.isRequired && option.bundleOptionProducts.edges.length > 0) {
                if (option.type === "radio" || option.type === "select") {
                    initialSelections[optionId] = [
                        option.bundleOptionProducts.edges[0].node.id.split("/").pop(),
                    ];
                }
            }

            option.bundleOptionProducts.edges.forEach(({ node }: any) => {
                const bundleProductId = node.id.split("/").pop();
                initialQuantities[bundleProductId] = node.qty || 1;
            });
        });

        return { selections: initialSelections, quantities: initialQuantities };
    }, [bundleOptions]);

    const [selections, setSelections] = useState<Record<string, string[]>>(() => getInitialState().selections);
    const [quantities, setQuantities] = useState<Record<string, number>>(() => getInitialState().quantities);

    const { totalPrice, formattedSelections, formattedQuantities } = useMemo(() => {
        let newTotal = basePrice;
        const fSelections: Record<string, string[]> = {};
        const fQuantities: Record<string, number> = {};

        bundleOptions?.edges?.forEach(({ node: option }: any) => {
            const optionId = option.id.split("/").pop();
            const selectedIds = selections[optionId] || [];

            if (selectedIds.length > 0) {
                fSelections[optionId] = selectedIds;

                selectedIds.forEach((bundleProductId: string) => {
                    const bundleOptionProduct = option.bundleOptionProducts.edges.find(
                        ({ node }: any) => node.id.split("/").pop() === bundleProductId
                    )?.node;

                    if (bundleOptionProduct) {
                        const productPrice = parseFloat(String(bundleOptionProduct.product.price)) || 0;
                        const qty = quantities[bundleProductId] || 1;
                        newTotal += productPrice * qty;

                        if (bundleOptionProduct.isUserDefined) {
                            fQuantities[bundleProductId] = qty;
                        }
                    }
                });
            }
        });

        return { totalPrice: newTotal, formattedSelections: fSelections, formattedQuantities: fQuantities };
    }, [selections, quantities, basePrice, bundleOptions]);

    useEffect(() => {
        onSelectionChange(formattedSelections, formattedQuantities, totalPrice);
    }, [formattedSelections, formattedQuantities, totalPrice, onSelectionChange]);

    const handleOptionToggle = (optionId: string, bundleProductId: string, type: string, isRequired: boolean) => {
        setSelections(prev => {
            const currentSelected = prev[optionId] || [];
            if (type === 'radio' || type === 'select') {
                if (currentSelected.includes(bundleProductId) && !isRequired) {
                    return { ...prev, [optionId]: [] };
                }
                return { ...prev, [optionId]: [bundleProductId] };
            } else {
                const isAlreadySelected = currentSelected.includes(bundleProductId);
                const nextSelected = isAlreadySelected
                    ? currentSelected.filter(id => id !== bundleProductId)
                    : [...currentSelected, bundleProductId];
                return { ...prev, [optionId]: nextSelected };
            }
        });
    };

    const handleQuantityChange = (bundleProductId: string, delta: number) => {
        setQuantities((prev) => ({
            ...prev,
            [bundleProductId]: Math.min(100, Math.max(1, (prev[bundleProductId] || 1) + delta))
        }));
    };

    const setQuantity = (bundleProductId: string, value: number) => {
        setQuantities((prev) => ({
            ...prev,
            [bundleProductId]: Math.min(100, Math.max(1, Math.floor(value || 1)))
        }));
    };

    if (!bundleOptions?.edges?.length) return null;

    return (
        <div className="flex flex-col gap-8 my-2">
            <div className="flex flex-col gap-1">
                {bundleOptions.edges.map(({ node: option }: any) => {
                    const optionId = option.id.split("/").pop();
                    const optionType = option.type;
                    const isRequired = option.isRequired;

                    return (
                        <div key={option.id} className="flex flex-col gap-4 mt-10 first:mt-0">
                            <h3 className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">
                                {option.translation?.label}
                                {isRequired && <span className="ml-0.5">*</span>}
                            </h3>

                            <div className="flex flex-col gap-2">
                                {option.bundleOptionProducts.edges.map(({ node: bundleOptionProduct }: any) => {
                                    const bundleProductId = bundleOptionProduct.id.split("/").pop();
                                    const product = bundleOptionProduct.product;
                                    const isSelected = selections[optionId]?.includes(bundleProductId);
                                    const isRadio = optionType === "radio" || optionType === "select";

                                    return (
                                        <div key={bundleOptionProduct.id} className="flex items-start gap-3 cursor-pointer group" onClick={() => handleOptionToggle(optionId, bundleProductId, optionType, isRequired)}>
                                            <div className="mt-[5px] shrink-0">
                                                {isRadio ? (
                                                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${isSelected
                                                        ? 'border-primary dark:border-primary-soft'
                                                        : 'border-gray-300 dark:border-zinc-700'
                                                        }`}>
                                                        {isSelected && (
                                                            <div className="w-2.5 h-2.5 rounded-full bg-primary dark:bg-primary-soft" />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${isSelected
                                                        ? 'bg-primary border-primary dark:bg-primary-soft dark:border-primary-soft'
                                                        : 'bg-white border-gray-300 dark:bg-zinc-900 dark:border-zinc-700'
                                                        }`}>
                                                        {isSelected && (
                                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-outfit font-normal text-base text-selected-black dark:text-white leading-tight">
                                                        {product.name}
                                                    </span>
                                                    <Price
                                                        amount={String(product.price)}
                                                        currencyCode={currencyCode}
                                                        className="font-outfit font-semibold text-base text-black dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {(() => {
                                    const selectedId = selections[optionId]?.[0];
                                    const selectedProduct = option.bundleOptionProducts.edges.find(
                                        ({ node }: any) => node.id.split("/").pop() === selectedId
                                    )?.node;

                                    if (selectedProduct?.isUserDefined) {
                                        return (
                                            <div
                                                className="flex items-center justify-between rounded-full border-2 border-primary dark:border-primary-soft bg-gray-50/50 dark:bg-zinc-900/50 shrink-0 mt-2"
                                                style={{
                                                    width: '145px',
                                                    height: '55px',
                                                    minWidth: '145px',
                                                    paddingLeft: '26px',
                                                    paddingRight: '26px',
                                                    gap: '12px'
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuantityChange(selectedId, -1);
                                                    }}
                                                    className="flex items-center justify-center text-black dark:text-white hover:opacity-70 transition-opacity shrink-0 cursor-pointer"
                                                >
                                                    <MinusIcon className="h-4 w-4 stroke-[2.5]" />
                                                </button>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={100}
                                                    inputMode="numeric"
                                                    aria-label="Quantity"
                                                    value={quantities[selectedId]}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        setQuantity(selectedId, Number(e.target.value));
                                                    }}
                                                    className="flex-1 w-full min-w-0 bg-transparent text-center outline-none appearance-none font-outfit font-normal text-base text-black dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuantityChange(selectedId, 1);
                                                    }}
                                                    className="flex items-center justify-center text-black dark:text-white hover:opacity-70 transition-opacity shrink-0 cursor-pointer"
                                                >
                                                    <PlusIcon className="h-4 w-4 stroke-[2.5]" />
                                                </button>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col gap-[18px] mt-4 pb-8 max-w-[605px]">
                <div className="flex justify-between items-center">
                    <span className="font-outfit font-normal text-md text-black dark:text-white">Total Amount</span>
                    <Price
                        amount={String(totalPrice)}
                        currencyCode={currencyCode}
                        className="font-outfit font-semibold text-xl text-black dark:text-white"
                    />
                </div>

                <div className="flex flex-col gap-5">
                    {bundleOptions.edges.map(({ node: option }: any) => {
                        const optionId = option.id.split("/").pop();
                        const selectedIds = selections[optionId] || [];

                        if (selectedIds.length === 0) return null;

                        return (
                            <div key={option.id} className="flex flex-col gap-2">
                                <h4 className="font-outfit font-normal text-15 text-black dark:text-white">
                                    {option.translation?.label}
                                </h4>
                                <div className="flex flex-col gap-1">
                                    {selectedIds.map((bundleProductId: string) => {
                                        const bundleOptionProduct = option.bundleOptionProducts.edges.find(
                                            ({ node }: any) => node.id.split("/").pop() === bundleProductId
                                        )?.node;

                                        if (!bundleOptionProduct) return null;

                                        return (
                                            <div key={bundleProductId} className="flex items-center gap-1.5 text-black/60 dark:text-selected-white font-outfit font-normal text-base leading-tight">
                                                <span>{quantities[bundleProductId]} x</span>
                                                <span>{bundleOptionProduct.product.name}</span>
                                                <Price
                                                    amount={String(bundleOptionProduct.product.price)}
                                                    currencyCode={currencyCode}
                                                    className="font-semibold text-black dark:text-white ml-auto"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
