"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { deleteWishlistItemAction, moveWishlistToCartAction } from "@/utils/actions";
import { useToast } from "@/providers/ToastProvider";
import { useRouter } from "next/navigation";
import { useCartDetail } from "@/utils/hooks/useCartDetail";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure
} from "@heroui/react";
import { IMAGES } from "@/utils/constants";

interface WishlistCardProps {
    item: any;
}

export default function WishlistCard({ item }: WishlistCardProps) {
    const [quantity, setQuantity] = useState(1);
    const [isPending, startTransition] = useTransition();
    const { addToast } = useToast();
    const router = useRouter();
    const { getCartDetail } = useCartDetail();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const product = item.product;

    const handleRemove = async (onClose: () => void) => {
        startTransition(async () => {
            const res = await deleteWishlistItemAction(item.id);
            if (res.success) {
                addToast({
                    message: "Item removed from wishlist",
                    type: "warning",
                });
                onClose();
                router.refresh();
            } else {
                addToast({
                    message: res.message || "Failed to remove item",
                    type: "danger",
                });
                onClose();
            }
        });
    };

    const handleMoveToCart = async () => {
        const complexTypes = ["configurable", "downloadable", "booking", "bundle", "grouped"];

        if (complexTypes.includes(product.type)) {
            addToast({
                message: "Please select product options before adding to cart",
                type: "warning",
            });
            router.push(`/product/${product.urlKey}`);
            return;
        }

        startTransition(async () => {
            const res = await moveWishlistToCartAction(item._id || item.id, quantity);
            if (res.success) {
                addToast({
                    message: "Item moved to cart successfully",
                    type: "success",
                });
                await getCartDetail();
                router.refresh();
            } else {
                addToast({
                    message: res.message || "Failed to move item to cart",
                    type: "danger",
                });
            }
        });
    };

    return (
        <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full h-auto md:h-auto 2xl:h-[178px] p-0 md:p-5 2xl:p-6 bg-white dark:bg-neutral-900 border-b border-dark-grey md:border-border-muted dark:md:border-neutral-800 transition-all duration-300 gap-0 md:gap-4 2xl:gap-0 pb-6 md:pb-5 2xl:pb-6 mb-6 md:mb-0">
                <div className="flex flex-row items-start md:items-center gap-3 md:gap-5 2xl:gap-6 w-full 2xl:max-w-[759px]">
                    <Link href={`/product/${product.urlKey}`} className="relative w-18 md:w-[100px] 2xl:w-[130px] h-18 md:h-[100px] 2xl:h-[130px] rounded-md overflow-hidden bg-neutral-50 dark:bg-neutral-800 shrink-0 group cursor-pointer block">
                        <Image
                            src={product.baseImageUrl || IMAGES.placeholder}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </Link>

                    <div className="flex flex-col gap-3 md:gap-4 2xl:gap-6 flex-1">
                        <div className="flex items-start justify-between w-full">
                            <Link href={`/product/${product.urlKey}`} className="flex-1">
                                <h3 className="font-outfit font-normal md:font-medium text-base md:text-xl 2xl:text-xl leading-[100%] md:leading-[100%] text-black dark:text-white hover:text-accent transition-colors line-clamp-2 cursor-pointer">
                                    {product.name}
                                </h3>
                            </Link>

                            <button
                                onClick={onOpen}
                                disabled={isPending}
                                className="block md:hidden text-primary dark:text-primary-soft font-outfit font-medium text-xs leading-[100%] cursor-pointer shrink-0 ml-2"
                            >
                                Remove
                            </button>
                        </div>

                        <p className="font-outfit font-semibold text-lg md:hidden leading-[100%] text-black dark:text-white">
                            ${parseFloat(product.minimumPrice).toLocaleString()}
                        </p>

                        <div className="flex items-center gap-[16px] md:gap-4 mt-0 md:mt-0">
                            <div className="flex items-center justify-between w-[105px] md:w-[120px] lg:w-[129px] h-[39px] md:h-[45px] lg:h-12 px-[18px] md:px-4 lg:px-[18px] py-3 md:py-3 lg:py-3.5 border-2 border-primary-soft md:border-primary dark:md:border-primary-soft rounded-full bg-overlay-subtle dark:bg-neutral-800 md:bg-white dark:md:bg-neutral-900 transition-all">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-selected-black dark:text-selected-white hover:text-primary dark:hover:text-primary-soft transition-colors cursor-pointer flex-shrink-0"
                                >
                                    <Minus size={14} className="md:w-4 md:h-4" />
                                </button>
                                <span className="font-outfit font-semibold text-xs md:text-15 lg:text-base text-black dark:text-white">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-selected-black dark:text-selected-white hover:text-primary dark:hover:text-primary-soft transition-colors cursor-pointer flex-shrink-0"
                                >
                                    <Plus size={14} className="md:w-4 md:h-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleMoveToCart}
                                disabled={isPending}
                                className="flex items-center justify-center h-[39px] md:h-[45px] 2xl:h-[55px] px-4 md:px-4 2xl:px-5 py-3 md:py-3 2xl:py-4 2xl:w-[135px] 2xl:rounded-full bg-transparent text-primary dark:text-primary-soft hover:opacity-90 hover:text-primary-strong dark:hover:text-blue-300 font-outfit font-semibold text-xs md:text-base lg:text-lg leading-[100%] md:leading-none rounded-md md:rounded-none transition-all disabled:opacity-50 cursor-pointer flex-shrink-0"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-end justify-center gap-3 w-[83px] 2xl:h-[62px]">
                    <p className="font-outfit font-semibold text-xl 2xl:text-2xl 2xl:leading-[100%] leading-none text-black dark:text-white whitespace-nowrap">
                        ${parseFloat(product.minimumPrice).toLocaleString()}
                    </p>
                    <button
                        onClick={onOpen}
                        disabled={isPending}
                        className="text-danger-strong dark:text-danger-strong hover:text-red-700 dark:hover:text-red-400 font-outfit font-medium text-sm 2xl:text-base leading-none transition-colors cursor-pointer"
                    >
                        Remove
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="blur"
                scrollBehavior="inside"
                classNames={{
                    base: "bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-[400px] m-auto",
                    header: "font-outfit text-2xl font-bold text-black dark:text-white border-b-0",
                    body: "font-outfit text-lg text-selected-black dark:text-selected-white py-4",
                    footer: "border-t-0 pt-0",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Remove from Wishlist</ModalHeader>
                            <ModalBody>
                                Are you sure you want to remove this item from your wishlist?
                            </ModalBody>
                            <ModalFooter className="gap-4">
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                    className="font-outfit font-bold text-base px-8 py-3 rounded-full h-auto text-selected-black dark:text-selected-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={() => handleRemove(onClose)}
                                    isLoading={isPending}
                                    className="font-outfit font-bold text-base px-10 py-3 rounded-full bg-red-500 text-white h-auto shadow-lg shadow-red-200 dark:shadow-none"
                                >
                                    Remove
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
