"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCompareAction, deleteAllCompareAction, addProductToCartAction } from "@/utils/actions";
import { removeIdFromCache, clearCache as clearCompareCache } from "@/utils/compare-cache";
import { useCustomToast } from "@/utils/hooks/useToast";
import { useRouter } from "next/navigation";
import { useCartDetail } from "@/utils/hooks/useCartDetail";
import clsx from "clsx";
import { IMAGES, CURRENCY_CODE } from "@/utils/constants";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import { formatPrice } from "@utils/helper";
import OrderPagination from "../orders/OrderPagination";
import {
    CompareProduct,
    CompareProductView,
    CompareReviewNode,
    CompareItemNode,
    CustomerEdge,
} from "@/types/customer/type";

interface CompareTableItem {
    node?: CompareItemNode;
    product?: CompareProduct;
    id?: string;
}



const HtmlExpandable = ({ html }: { html: string }) => {
    const [expanded, setExpanded] = useState(false);

    const plainText = html?.replace(/<[^>]*>/g, "").trim() ?? "";

    if (!plainText) {
        return (
            <span className="font-outfit text-13 text-selected-black dark:text-selected-white">
                N/A
            </span>
        );
    }

    const isLong = plainText.length > 60;

    return (
        <div className="font-outfit text-base leading-[1.5] text-neutral-600 dark:text-selected-white">
            {expanded ? (
                <>
                    <div
                        className="prose dark:prose-invert prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                    <button
                        onClick={() => setExpanded(false)}
                        className="text-primary dark:text-blue-400 text-base font-normal hover:underline mt-1 block"
                    >
                        show less
                    </button>
                </>
            ) : (
                <>
                    <div
                        className="line-clamp-1 prose dark:prose-invert prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                    {isLong && (
                        <button
                            onClick={() => setExpanded(true)}
                            className="text-primary dark:text-blue-400 text-base font-normal hover:underline mt-1 block"
                        >
                            ...read more
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

const StarIcons = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
            <svg
                key={i}
                className={`size-[18px] ${i < Math.round(rating)
                    ? "fill-tertiary"
                    : "fill-quaternary dark:fill-neutral-700"
                    }`}
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const StarCell = ({
    product,
    mobile,
}: {
    product: CompareProductView;
    mobile?: boolean;
}) => (
    <div
        className="flex flex-col"
        style={{ gap: 8, minHeight: mobile ? 82 : undefined }}
    >
        <StarIcons rating={product.avgRating} />
        <span
            className={clsx(
                "font-outfit font-normal leading-none",
                mobile
                    ? "text-base text-selected-black dark:text-selected-white"
                    : "text-base text-selected-black dark:text-selected-white"
            )}
        >
            {product.avgRating > 0
                ? product.avgRating % 1 === 0
                    ? product.avgRating
                    : product.avgRating.toFixed(1)
                : 0}{" "}
            Stars
        </span>
        <span
            className={clsx(
                "font-outfit font-normal leading-none",
                mobile
                    ? "text-base text-neutral-700 dark:text-white"
                    : "text-base text-neutral-700 dark:text-white"
            )}
        >
            ({product.totalReviews} Reviews)
        </span>
    </div>
);

export default function CompareTable({
    items,
    totalPages,
    currentPage,
    nextCursor,
    limit,
    totalCount
}: {
    items: CompareTableItem[];
    totalPages: number;
    currentPage: number;
    nextCursor?: string;
    limit: number;
    totalCount: number;
}) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

    const { showToast } = useCustomToast();
    const router = useRouter();
    const { getCartDetail } = useCartDetail();

    const handleRemove = async (compareId: string, productId: string) => {
        setDeletingId(compareId);
        const result = await deleteCompareAction(compareId);
        if (result.success) {
            removeIdFromCache(String(productId));
            showToast(result.message || "Product removed from comparison list", "warning");
            router.refresh();
        } else {
            showToast(result.message || "Failed to remove product", "danger");
        }
        setDeletingId(null);
    };

    const handleDeleteAll = async () => {
        setIsDeletingAll(true);
        const result = await deleteAllCompareAction();
        if (result.success) {
            clearCompareCache();
            showToast(result.message || "All products removed from comparison list", "warning");
            router.refresh();
        } else {
            showToast(result.message || "Failed to remove products", "danger");
        }
        setIsDeletingAll(false);
    };

    const handleAddToCart = async (product: CompareProductView) => {
        const complexTypes = ["configurable", "downloadable", "booking", "bundle", "grouped"];
        if (complexTypes.includes(product.type)) {
            showToast("Please select product options before adding to cart", "warning");
            router.push(`/product/${product.urlKey}`);
            return;
        }
        setAddingToCartId(product.id);
        const res = await addProductToCartAction(product.id, 1);
        if (res.success) {
            showToast(res.message || "Product added to cart successfully", "success");
            await getCartDetail();
            router.refresh();
        } else {
            showToast(res.message || "Failed to add product to cart", "danger");
        }
        setAddingToCartId(null);
    };

    const products: CompareProductView[] = items.map((item: CompareTableItem) => {
        const product = item?.node?.product || item?.product;
        const reviews = product?.reviews;
        const reviewEdges = reviews?.edges || [];
        const totalRating = reviewEdges.reduce(
            (acc: number, edge: CustomerEdge<CompareReviewNode>) => acc + (edge?.node?.rating || 0),
            0
        );
        const avgRating =
            (reviews?.totalCount || 0) > 0
                ? totalRating / (reviews?.totalCount || 1)
                : 0;
        const formattedMinimumPrice = product?.formattedMinimumPrice || formatPrice(product?.minimumPrice, CURRENCY_CODE);
        const formattedPrice = product?.formattedPrice || formatPrice(product?.price, CURRENCY_CODE);
        const formattedMaximumPrice = product?.formattedMaximumPrice || formatPrice(product?.maximumPrice, CURRENCY_CODE);

        return {
            ...product,
            compareId: item?.node?.id || item?.id,
            avgRating,
            totalReviews: reviews?.totalCount || 0,
            formattedMinimumPrice,
            formattedPrice,
            formattedMaximumPrice,
        } as CompareProductView;
    });

    const compareFields: {
        label: string;
        key: keyof CompareProductView;
        customRender?: boolean;
        isHtml?: boolean;
        getValue?: (val: unknown) => string;
    }[] = [
        { label: "Customer Ratings", key: "avgRating", customRender: true },
        { label: "Product Name", key: "name" },
        { label: "Price", key: "formattedMinimumPrice" },
        { label: "Short Description", key: "shortDescription", isHtml: true },
        { label: "Description", key: "description", isHtml: true },
        {
            label: "Availability",
            key: "guestCheckout",
            getValue: (val: unknown) => (val === "1" ? "In Stock" : "Out of Stock"),
        },
    ];

    return (
        <div className="flex flex-col gap-0 w-full">

            <div className="lg:hidden -mx-4">
                <ScrollableContainer
                    className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4"
                >
                    <table
                        className="text-left border-collapse"
                        style={{ tableLayout: "fixed", width: "max-content" }}
                    >
                        <thead>
                            <tr>
                                <th style={{ width: 90, minWidth: 90 }} />

                                {products.map((product) => (
                                    <th
                                        key={`mob-header-${product.compareId}`}
                                        style={{
                                            width: 152,
                                            minWidth: 152,
                                            verticalAlign: "top",
                                            paddingRight: 12,
                                            paddingBottom: 16,
                                        }}
                                    >
                                        <div className="relative flex flex-col" style={{ gap: 12, width: 152 }}>
                                            <button
                                                onClick={() => handleRemove(product.compareId, product.id)}
                                                disabled={deletingId === product.compareId || isDeletingAll}
                                                className="absolute top-2 right-2 z-20 p-2 bg-white/80 dark:bg-neutral-800/80 text-red-500 rounded-full shadow-md backdrop-blur-sm disabled:opacity-50 cursor-pointer"
                                                title="Remove"
                                            >
                                                {deletingId === product.compareId ? (
                                                    <Loader2 size={15} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={15} />
                                                )}
                                            </button>

                                            <Link
                                                href={`/product/${product.urlKey}`}
                                                className="relative overflow-hidden bg-septenary dark:bg-neutral-800 flex-shrink-0 block"
                                                style={{ width: 152, height: 140, borderRadius: 8 }}
                                            >
                                                <Image
                                                    src={product.baseImageUrl || IMAGES.placeholder}
                                                    alt={product.name || "Product"}
                                                    fill
                                                    className="object-cover"
                                                    sizes="152px"
                                                />
                                            </Link>

                                            <div className="min-h-10">
                                                <Link
                                                    href={`/product/${product.urlKey}`}
                                                    className="font-outfit font-normal text-sm leading-[1.3] text-neutral-800 dark:text-white line-clamp-2"
                                                >
                                                    {product.name}
                                                </Link>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap min-h-[20px]">
                                                <span className="font-outfit font-medium text-base leading-none text-black dark:text-white">
                                                    {product.formattedMinimumPrice}
                                                </span>
                                                {product.price !== product.minimumPrice &&
                                                    product.price !== "0" && (
                                                        <span className="font-outfit font-normal text-13 text-neutral-400 line-through">
                                                            {product.formattedPrice}
                                                        </span>
                                                    )}
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={addingToCartId === product.id || isDeletingAll}
                                                className="flex items-center justify-center bg-primary text-white font-outfit font-semibold text-13 hover:bg-blue-700 active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                style={{
                                                    width: 152,
                                                    height: 42,
                                                    borderRadius: 100,
                                                    gap: 6,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {addingToCartId === product.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : null}
                                                Add to Cart
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {compareFields.map((field, index) => (
                                <tr
                                    key={`mob-field-${field.label}`}
                                    className={clsx(
                                        "border-neutral-100 dark:border-neutral-800",
                                        index === 0 ? "border-t" : "border-t"
                                    )}
                                >
                                    <td
                                        className="font-outfit font-semibold text-sm leading-[1.2] text-neutral-900 dark:text-white align-top"
                                        style={{
                                            width: 90,
                                            minWidth: 90,
                                            paddingTop: 16,
                                            paddingBottom: 16,
                                            paddingRight: 10,
                                        }}
                                    >
                                        {field.label}
                                    </td>

                                    {products.map((product) => (
                                        <td
                                            key={`mob-cell-${product.compareId}-${field.key}`}
                                            className="align-top"
                                            style={{
                                                width: 152,
                                                minWidth: 152,
                                                paddingTop: 16,
                                                paddingBottom: 16,
                                                paddingRight: 12,
                                            }}
                                        >
                                            {field.customRender ? (
                                                <StarCell product={product} mobile />
                                            ) : field.getValue ? (
                                                <span className="font-outfit text-base text-neutral-600 dark:text-selected-white">
                                                    {field.getValue(product[field.key])}
                                                </span>
                                            ) : field.isHtml ? (
                                                <HtmlExpandable html={product[field.key] as string} />
                                            ) : (
                                                <span className="font-outfit text-base text-neutral-600 dark:text-selected-white">
                                                    {(product[field.key] as string) || "N/A"}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </ScrollableContainer>
                    {totalPages > 1 && (
                        <div className="flex flex-row justify-between items-center h-10 mt-6 px-4">
                            <p className="font-outfit font-normal text-xs leading-[20px] text-black dark:text-white">
                                Showing {(currentPage - 1) * limit + 1} to {Math.min((currentPage - 1) * limit + products.length, totalCount)} of {totalCount} entries
                            </p>
                            <OrderPagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                nextCursor={nextCursor}
                            />
                        </div>
                    )}
            </div>

            <div className="hidden lg:block w-full">
                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleDeleteAll}
                        disabled={isDeletingAll}
                        className="flex items-center gap-2 px-6 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-outfit font-medium text-base hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50"
                    >
                        {isDeletingAll ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Trash2 size={20} className="text-neutral-900 dark:text-white" />
                        )}
                        Delete All
                    </button>
                </div>

                <div className="w-full overflow-hidden bg-white dark:bg-neutral-900">
                    <ScrollableContainer className="overflow-x-auto compare-scrollbar">
                        <table
                            className={clsx(
                                "text-left border-collapse table-fixed",
                                products.length > 2 ? "w-full min-w-[800px]" : "w-fit"
                            )}
                        >
                            <thead>
                                <tr>
                                    <th className="p-4 w-[250px] align-bottom pb-14 md:sticky md:left-0 bg-white dark:bg-neutral-900 z-20">
                                    </th>
                                    {products.map((product) => (
                                        <th
                                            key={`header-${product.compareId}`}
                                            className="p-4 align-top w-[320px] pb-14"
                                        >
                                            <div className="flex flex-col gap-4 relative group">
                                                <button
                                                    onClick={() => handleRemove(product.compareId, product.id)}
                                                    disabled={deletingId === product.compareId || isDeletingAll}
                                                    className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-neutral-800/80 text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10 disabled:opacity-50 backdrop-blur-sm cursor-pointer"
                                                    title="Remove from comparison"
                                                >
                                                    {deletingId === product.compareId ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>

                                                <div className="flex flex-col gap-4">
                                                    <Link
                                                        href={`/product/${product.urlKey}`}
                                                        className="relative h-[220px] w-full rounded-3xl overflow-hidden bg-surface-cool dark:bg-neutral-800 shadow-sm group-hover:shadow-md transition-shadow block"
                                                    >
                                                        <Image
                                                            src={product.baseImageUrl || IMAGES.placeholder}
                                                            alt={product.name || "Product Image"}
                                                            fill
                                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </Link>

                                                    <div className="flex flex-col gap-2">
                                                        <div className="min-h-11">
                                                            <Link
                                                                href={`/product/${product.urlKey}`}
                                                                className="font-outfit text-sm lg:text-base font-normal lg:font-medium text-senary dark:text-white hover:text-primary transition-colors line-clamp-2 leading-[1.3]"
                                                            >
                                                                {product.name}
                                                            </Link>
                                                        </div>

                                                        <div className="flex items-center gap-2 min-h-[24px]">
                                                            <span className="text-base font-medium text-black dark:text-white font-outfit">
                                                                {product.formattedMinimumPrice}
                                                            </span>
                                                            {product.price !== product.minimumPrice &&
                                                                product.price !== "0" && (
                                                                    <span className="text-sm lg:text-base text-quinary font-normal lg:font-medium dark:text-white line-through">
                                                                        {product.formattedPrice}
                                                                    </span>
                                                                )}
                                                        </div>

                                                        <div className="mt-2">
                                                            <button
                                                                onClick={() => handleAddToCart(product)}
                                                                disabled={addingToCartId === product.id || isDeletingAll}
                                                                className="flex items-center justify-center w-full max-w-[300px] h-[48px] gap-[10px] py-[12px] px-[40px] rounded-[100px] bg-primary text-white font-outfit font-semibold text-sm lg:text-base hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                            >
                                                                {addingToCartId === product.id ? (
                                                                    <Loader2 size={18} className="animate-spin" />
                                                                ) : null}
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {compareFields.map((field, index) => (
                                    <tr
                                        key={`field-row-${field.label}`}
                                        className={clsx(
                                            "border-neutral-100 dark:border-neutral-800",
                                            index === 0 ? "border-t md:border-t-0" : "border-t"
                                        )}
                                    >
                                        <td className="p-6 font-outfit text-sm lg:text-xl font-semibold text-neutral-900 dark:text-white w-[250px] md:sticky md:left-0 bg-white dark:bg-neutral-900 z-10">
                                            {field.label}
                                        </td>

                                        {products.map((product) => (
                                            <td
                                                key={`cell-${product.compareId}-${field.key}`}
                                                className="p-6 w-[320px] align-top"
                                            >
                                                <div className="font-outfit text-base text-neutral-600 dark:text-selected-white leading-relaxed">
                                                    {field.customRender ? (
                                                        <StarCell product={product} />
                                                    ) : field.getValue ? (
                                                        field.getValue(product[field.key])
                                                    ) : field.isHtml ? (
                                                        <HtmlExpandable html={product[field.key] as string} />
                                                    ) : (
                                                        (product[field.key] as string) || "N/A"
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ScrollableContainer>
                    {totalPages > 1 && (
                        <div className="flex flex-row justify-between items-center h-10 mt-6 px-4">
                            <p className="font-outfit font-normal text-xs leading-[20px] text-black dark:text-white">
                                Showing {(currentPage - 1) * limit + 1} to {Math.min((currentPage - 1) * limit + products.length, totalCount)} of {totalCount} entries
                            </p>
                            <OrderPagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                nextCursor={nextCursor}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
