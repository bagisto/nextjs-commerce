"use client";

import { Button } from "@components/common/button/Button";
import { Rating } from "@components/common/Rating";
import { ReviewIcon } from "@components/common/icons/ReviewIcon";
import { GridTileImage } from "@components/theme/ui/grid/Tile";
import { formatDate, getInitials, getReviews } from "@/utils/helper";
import { isArray } from "@/utils/type-guards";
import { Avatar, Tooltip } from "@heroui/react";
import clsx from "clsx";
import { FC, useState } from "react";
import { ReviewDetailProps } from "../type";


const ReviewDetail: FC<ReviewDetailProps> = ({ reviewDetails, totalReview }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  if (!Array.isArray(reviewDetails) || reviewDetails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pb-2">
        <ReviewIcon />
        <h2 className="font-outfit text-xl tracking-wide">No Review found</h2>
        <p className="font-outfit tracking-wide text-neutral-800 dark:text-white">
          Be the first to review this product
        </p>
      </div>
    );
  }

  const { reviewAvg, ratingCounts } = getReviews(reviewDetails);

  const visibleReviews = reviewDetails.slice(0, visibleCount);

  return totalReview ? (
    <div className="flex flex-wrap gap-x-5 sm:gap-x-10">
      <div className="my-2 flex w-full flex-col flex-wrap justify-between gap-4 sm:flex-row sm:items-center min-[1350px]:flex-nowrap">
        <div className="flex items-center gap-x-2">
          <Rating
            length={5}
            size="size-5"
            star={reviewAvg}
            totalReview={totalReview}
          />
        </div>

        <div className="flex">
          {Object.entries(ratingCounts)
            .reverse()
            .map(([star, count]) => (
              <div key={star + count}>
                <Tooltip
                  content={
                    <p className="text-center">
                      {star} Star <br /> {count}{" "}
                      {count >= 2 ? "Reviews" : "Review"}
                    </p>
                  }
                  placement="top"
                  className="cursor-pointer"
                >
                  <div
                    className={clsx(
                      "min-h-4 !cursor-pointer",
                      star === "5" && "min-w-24 rounded-l-sm",
                      star === "4" && "min-w-16",
                      star === "3" && "min-w-12",
                      star === "2" && "min-w-12",
                      star === "1" && "min-w-6 rounded-r-sm",
                      count > 0
                        ? star === "5"
                          ? "bg-green-700"
                          : star === "4"
                            ? "bg-cyan-400"
                            : star === "3"
                              ? "bg-violet-600"
                              : star === "2"
                                ? "bg-yellow-400"
                                : "bg-red-600"
                        : "bg-gray-400"
                    )}
                  />
                </Tooltip>
              </div>
            ))}
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col gap-5 py-2 sm:pt-6">
        {/* Scrollable Container */}
        <div
          className="max-h-[380px] overflow-y-auto pr-2 
        scrollbar-thin scrollbar-track-transparent 
        scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-600"
        >
          {visibleReviews.map(
            (
              { name, title, comment, createdAt, rating, images, customer },
              index
            ) => (
              <div
                key={index}
                className="flex flex-col gap-y-2 pb-6 border-b border-neutral-200 dark:border-neutral-700"
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
                      className="h-[56px] min-w-[56px] border border-solid border-black/10 bg-white text-large dark:bg-neutral-900"
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

                {isArray(images) && images.length > 0 && (
                  <div className="mt-2 flex h-full min-h-[50px] w-full max-w-[60px] flex-wrap gap-2">
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
            )
          )}
        </div>

        {reviewDetails.length > visibleCount && (
          <Button
            title="Load More"
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="mx-auto"
          />
        )}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center pb-2">
      <ReviewIcon />
      <h2 className="font-outfit text-xl tracking-wide">No Review found</h2>
      <p className="font-outfit tracking-wide text-neutral-800 dark:text-white">
        Be the first to review this product
      </p>
    </div>
  );
};

export default ReviewDetail;
