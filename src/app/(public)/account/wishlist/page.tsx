import Image from "next/image";
import { getAllWishlists } from "@/utils/bagisto";
import type { CustomerEdge, WishlistItemNode } from "@/types/customer/type";
import ReviewPagination from "@components/customer-detail/review/ReviewPagination";
import WishlistCard from "@components/customer-detail/wishlist/WishlistCard";
import AccountBreadcrumbs from "@/components/layout/AccountBreadcrumbs";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { IMAGES } from "@/utils/constants";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

export default async function WishlistPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const limit = Number(params?.limit) || 10;
    const currentPage = Number(params?.page) || 1;
    const after = params?.cursor as string | undefined;

    let currentAfterCursor = after;
    if (currentPage > 1 && !after) {
        const precedingData = await getAllWishlists({
            first: (currentPage - 1) * limit,
        });
        currentAfterCursor = precedingData?.pageInfo?.endCursor;
    }

    const data = await getAllWishlists({
        first: limit,
        after: currentAfterCursor,
    });

    const wishlistItems = data?.edges || [];
    const totalCount = data?.totalCount || 0;
    const pageInfo = data?.pageInfo;
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="w-full xl:max-w-[1170px]">
            <HideMainNavOnMobile />
            <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
                <MobileNavHeader backUrl="/account" />
            </div>

            <div className="hidden lg:block">
                <AccountBreadcrumbs />
            </div>

            <div className="flex items-center mt-5 lg:mt-2.5 mb-6 lg:mb-7_5 lg:mb-7_5 pb-2.5 lg:border-none lg:pb-0">
                <h1 className="font-outfit font-semibold text-2xl leading-[24px] lg:font-medium lg:text-26 lg:leading-[40px] text-black dark:text-white text-left">
                    Wishlist
                </h1>
            </div>

            {totalCount === 0 ? (
                <div className="flex flex-col items-center justify-center w-full max-w-[1170px] min-h-[528px] gap-4">
                    <div className="relative w-[384px] h-[295px]">
                        <Image
                            src={IMAGES.emptyWishlist}
                            alt="No products were added to the wishlist page."
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="font-outfit font-normal text-xl leading-none text-center text-black dark:text-white">
                        No products were added to the wishlist page.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        {wishlistItems.map((edge: CustomerEdge<WishlistItemNode>) => (
                            <WishlistCard key={edge.node.id} item={edge.node} />
                        ))}
                    </div>

                    {totalCount > 0 && (
                        <div className="py-6 flex flex-row justify-between items-center h-10 mt-6">
                            <p className="font-outfit font-normal text-sm leading-[20px] text-black dark:text-white">
                                Showing {(currentPage - 1) * limit + 1} to {Math.min((currentPage - 1) * limit + wishlistItems.length, totalCount)} of {totalCount} entries
                            </p>
                            <ReviewPagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                nextCursor={pageInfo?.endCursor}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

