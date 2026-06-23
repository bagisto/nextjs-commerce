import { getCustomerReviews } from "@/utils/bagisto";
import Link from "next/link";
import Image from "next/image";
import AccountBreadcrumbs from "@/components/layout/AccountBreadcrumbs";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { IMAGES } from "@/utils/constants";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";
import { ReviewRating } from "@components/customer-detail/review/ReviewRating";
import ReviewPagination from "@components/customer-detail/review/ReviewPagination";



export default async function ReviewsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const params = await searchParams;
    const limit = Number(params?.limit) || 10;
    const currentPage = Number(params?.page) || 1;
    const after = params?.cursor as string | undefined;

    let currentAfterCursor = after;
    if (currentPage > 1 && !after) {
        const precedingData = await getCustomerReviews({
            first: (currentPage - 1) * limit,
        });
        currentAfterCursor = precedingData?.pageInfo?.endCursor;
    }

    const data = await getCustomerReviews({
        first: limit,
        after: currentAfterCursor,
    });

    const reviews = data?.edges || [];
    const totalCount = data?.totalCount || 0;
    const pageInfo = data?.pageInfo;
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="w-full max-w-[1170px]">
            <HideMainNavOnMobile />
            <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
                <MobileNavHeader backUrl="/account" />
            </div>

            <div className="hidden lg:block">
                <AccountBreadcrumbs />
            </div>

            <div className="flex items-center mt-5 lg:mt-2.5 mb-6 lg:mb-7_5 pb-2.5 lg:border-none lg:pb-0">
                <h1 className="font-outfit font-semibold text-2xl leading-[24px] lg:font-medium lg:text-26 lg:leading-[40px] text-black dark:text-white text-left">
                    Reviews
                </h1>
            </div>

            {totalCount === 0 ? (
                <div className="flex flex-col items-center justify-center w-full max-w-[1170px] min-h-[528px] gap-4">
                    <div className="relative w-[384px] h-[295px]">
                        <Image
                            src={IMAGES.noReview}
                            alt="No reviews"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="font-outfit font-normal text-xl leading-none text-center text-black dark:text-white">
                        You have not reviewed any product yet
                    </p>
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <div className="flex flex-col w-full">
                        {reviews.map((edge: any) => {
                            const review = edge.node;
                            const product = review.product;
                            const productName = product?.name || "Product Name";
                            const productImage = product?.baseImageUrl || IMAGES.placeholder;

                            return (
                                <div key={review._id} className="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-0 p-4 lg:p-6 border-b border-border-muted dark:border-neutral-800 w-full group">
                                    <div className="flex gap-4 lg:gap-6 w-full lg:max-w-[759px]">
                                        <Link
                                            href={`/product/${product?.urlKey}`}
                                            className="relative w-[100px] h-[100px] lg:w-[130px] lg:h-[130px] rounded-md overflow-hidden bg-surface-muted dark:bg-neutral-800 flex-shrink-0"
                                        >
                                            <Image
                                                src={productImage}
                                                alt={productName}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </Link>

                                        <div className="flex flex-col gap-2 lg:gap-3 flex-1">
                                            <Link href={`/product/${product?.urlKey}`}>
                                                <h3 className="font-outfit text-lg lg:text-xl font-medium text-black dark:text-white hover:text-accent transition-colors leading-tight lg:leading-none">
                                                    {productName}
                                                </h3>
                                            </Link>
                                            <div className="lg:hidden">
                                                <ReviewRating star={review.rating} />
                                            </div>
                                            <p 
                                                className="font-outfit text-sm lg:text-base text-muted font-normal leading-relaxed lg:leading-[30px] line-clamp-3"
                                            >
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="hidden lg:block flex-shrink-0">
                                        <ReviewRating star={review.rating} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="py-6 flex flex-row justify-between items-center h-10 mt-6">
                            <p className="font-outfit font-normal text-sm leading-[20px] text-black dark:text-white">
                                Showing {(currentPage - 1) * limit + 1} to {Math.min((currentPage - 1) * limit + reviews.length, totalCount)} of {totalCount} entries
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