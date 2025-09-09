"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React, { FC } from "react";
import { Avatar } from "@heroui/avatar";

import Rating from ".";

import { GridTileImage } from "@/components/grid/tile";
import Prose from "@/components/prose";
import { isArray } from "@/lib/type-guards";
import { formatDate, getInitials, getReviews } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Tooltip } from "@heroui/react";
import { ReviewIcon } from "../icons/review";

export type additionalDataTypes = {
  id: string;
  code: string;
  label: string;
  value: null;
  admin_name: string;
  type: string;
};

export const ProductMoreDetails: FC<{
  description: string;
  additionalData: additionalDataTypes[];
  reviews: any[];
  totalReview: number;
}> = ({ description, additionalData, reviews, totalReview }) => {
  return (
    <div className="mt-7 sm:my-7">
      <Accordion
        itemClasses={{
          base: "shadow-none  bg-neutral-100 dark:bg-neutral-800",
        }}
        className="px-0"
        selectionMode="multiple"
        showDivider={false}
        variant="splitted"
      >
        <AccordionItem
          key="1"
          indicator={({ isOpen }) =>
            isOpen ? (
              <ChevronLeftIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            )
          }
          aria-label="Description"
          title="Description"
        >
          <Prose className="pb-2" html={description} />
        </AccordionItem>
        <AccordionItem
          key="2"
          indicator={({ isOpen }) =>
            isOpen ? (
              <ChevronLeftIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            )
          }
          aria-label="Additional Information"
          title="Additional Information"
        >
          <div className="grid max-w-max grid-cols-[auto_1fr] gap-x-8 gap-y-4 px-1 pb-2">
            {additionalData?.map((item) => (
              <React.Fragment key={item.label}>
                <div className="grid">
                  <p className="text-base font-normal text-black/60 dark:text-white">
                    {item?.label}
                  </p>
                </div>
                <div className="grid">
                  <p className="text-base font-normal text-black/60 dark:text-white">
                    {item?.value || "--"}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </AccordionItem>
        {totalReview ? (
          <AccordionItem
            key="3"
            indicator={({ isOpen }) =>
              isOpen ? (
                <ChevronLeftIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
              ) : (
                <ChevronRightIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
              )
            }
            aria-label="Ratings"
            title="Ratings"
          >
            <ReviewDetail reviewDetails={reviews} totalReview={totalReview} />
          </AccordionItem>
        ) : null}
      </Accordion>
    </div>
  );
};
export interface ReviewDatatypes {
  id: string;
  name: string;
  title: string;
  rating: 5;
  status: string;
  comment: string;
  productId: string;
  customerId: string;
  createdAt: string;
  images: {
    url: string;
    reviewId: string;
  }[];
  customer: {
    name: string;
    imageUrl: string;
  };
}
export interface Props {
  reviewDetails: ReviewDatatypes[];
  totalReview: number;
}
const ReviewDetail: FC<Props> = ({ reviewDetails, totalReview }) => {
  const { reviewAvg, ratingCounts } = getReviews(reviewDetails);

  return totalReview ? (
    <div className="flex flex-wrap gap-x-5 sm:gap-x-10">
      {/* Rating Summary */}

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
                >
                  <div
                    className={clsx(
                      "min-h-4 cursor-pointer",
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

      {/* Reviews */}
      <div className="flex w-full flex-1 flex-col gap-5 py-2 sm:pt-6">
        {reviewDetails?.map(
          (
            { name, title, comment, createdAt, rating, images, customer },
            index
          ) => (
            <div key={index} className="flex flex-col gap-y-2">
              <h1 className="font-outfit text-xl font-medium text-black/[80%] dark:text-white">
                {title}
              </h1>
              <Rating className="my-1" length={5} size="size-5" star={rating} />
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
