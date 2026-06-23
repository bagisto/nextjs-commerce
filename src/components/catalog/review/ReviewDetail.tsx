"use client";

import { Rating } from "@components/common/Rating";
import { GridTileImage } from "@components/theme/ui/grid/Tile";
import { formatDate, getInitials, getReviews } from "@/utils/helper";
import { isArray } from "@/utils/type-guards";
import { Avatar, Tooltip } from "@heroui/react";
import clsx from "clsx";
import { FC, useState } from "react";
import ReviewSection from "./ReviewSection";
import { ProductReviewNode } from "@/components/catalog/type";

interface ProductReviewEdge {
  __typename: "ProductReviewEdge";
  node: ProductReviewNode;
}

interface ReviewDetailProps {
  reviewDetails: ProductReviewEdge[];
  totalReview: number;
  productId: string;
}

const ReviewDetail: FC<ReviewDetailProps> = ({
  reviewDetails,
  totalReview,
  productId,
}) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const reviews: ProductReviewNode[] =
    reviewDetails?.map((edge) => edge.node) || [];

  const { reviewAvg, ratingCounts } = getReviews(reviews);

  const visibleReviews = reviews.slice(0, visibleCount);

  return (
    <>
      <div className="flex flex-col flex-wrap gap-x-5 sm:gap-x-10">
        <div className="my-2 flex w-full flex-col flex-wrap justify-between gap-4 sm:flex-row sm:items-center min-[1350px]:flex-nowrap">
          <div className="flex items-center gap-x-2">
            <Rating
              length={5}
              size="size-5"
              star={reviewAvg}
              reviewCount={totalReview}
            />
          </div>

          <div className="flex w-full max-w-[280px] overflow-hidden rounded-sm">
            {Object.entries(ratingCounts)
              .reverse()
              .filter(([_, count]) => (count as number) > 0)
              .map(([star, count]) => (
                <div
                  key={star}
                  style={{ flex: count as number }}
                  className="min-h-4"
                >
                    <Tooltip
                      content={
                        <div className="relative">
                          <p className="text-center font-outfit text-[12px] font-normal leading-[100%]">
                            {star} Star <br /> {count as number} Rating
                          </p>
                          <div className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#000000E5]"></div>
                        </div>
                      }
                      placement="top"
                      classNames={{
                        base: "before:content-none after:content-none overflow-visible",
                        content: "bg-[#000000E5] text-white rounded-[8px] p-[8px_10px] w-[91px] h-[46px] flex items-center justify-center gap-[10px] !border-none !shadow-none"
                      }}
                    >
                      <div
                        className={clsx(
                          "h-full w-full !cursor-pointer",
                          star === "5"
                            ? "bg-green-700"
                            : star === "4"
                              ? "bg-[#0084D1]"
                              : star === "3"
                                ? "bg-violet-600"
                                : star === "2"
                                  ? "bg-yellow-400"
                                  : "bg-red-600",
                        )}
                      />
                    </Tooltip>
                </div>
              ))}
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col gap-5 py-2 sm:pt-6">
          <div
            className="max-h-[380px] overflow-y-auto pr-2 
        scrollbar-thin scrollbar-track-transparent 
        scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-600"
          >
            {visibleReviews &&
              visibleReviews.map(
                (
                  {
                    name,
                    title,
                    comment,
                    createdAt,
                    rating,
                    images,
                    customer,
                  }: ProductReviewNode,
                  index: number,
                ) => (
                  <div
                    key={index}
                    className={clsx("flex flex-col gap-y-2 py-3", {
                      "border-b border-neutral-200 dark:border-neutral-700":
                        visibleReviews.length > 1 &&
                        index < visibleReviews.length - 1,
                    })}
                  >
                    <h1 className="font-outfit text-xl font-medium text-black/[80%] dark:text-white">
                      {title}
                    </h1>
                    <Rating
                      className="my-1"
                      length={5}
                      size="size-5"
                      star={rating}
                    />

                    <h2 className="font-outfit text-base font-normal text-black/[80%] dark:text-white">
                      {comment}
                    </h2>

                    <div className="flex gap-4">
                      <div className="flex w-full items-center gap-2">
                        <Avatar
                          className="h-14 min-w-14 border border-solid border-black/10 bg-white text-large dark:bg-neutral-900"
                          name={getInitials(name)}
                          src={customer?.imageUrl}
                        />
                        <div>
                          <h1 className="font-outfit text-base font-medium text-black/80 dark:text-white">
                            {name}
                          </h1>
                          <p className="text-base text-black/80 dark:text-white">
                            {formatDate(createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isArray(images) && images && images.length > 0 && (
                      <div className="mt-2 flex h-full min-h-[50px] w-full max-w-15 flex-wrap gap-2">
                        {images.map((img) => (
                          <GridTileImage
                            key={img.reviewId}
                            fill
                            alt={`${img.reviewId}-review`}
                            className="rounded-lg"
                            src={img.url}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ),
              )}

            {reviews.length > visibleCount && (
              <div className="py-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="flex items-start gap-2 text-primary-600 cursor-pointer hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200 group"
                >
                  <span>Load More</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mx-auto ">
          <ReviewSection productId={productId} totalReview={totalReview} />
        </div>
      </div>
    </>
  );
};

export default ReviewDetail;
