"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React, { FC } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Prose from "@/components/theme/search/Prose";
import ReviewSection from "../review/ReviewSection";
import ReviewDetail from "../review/ReviewDetail";
import { additionalDataTypes } from "../type";

export const ProductMoreDetails: FC<{
  description: string;
  additionalData: additionalDataTypes[];
  productId: string;
  reviews: any[];
  totalReview: number;
}> = ({ description, additionalData, reviews, productId, totalReview }) => {

  const filterAdditionalData = additionalData.filter((item) => item?.attribute?.
    isVisibleOnFront == "1");


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
          classNames={{
            title: "text-start",
            trigger: "cursor-pointer",
          }}
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

        {filterAdditionalData.length > 0
          ?
          <AccordionItem
            key="2"
            classNames={{
              title: "text-start",
              trigger: "cursor-pointer",
            }}
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
              {filterAdditionalData?.map((item) => (
                <React.Fragment key={item.label}>
                  <div className="grid">
                    <p className="text-base font-normal text-black/60 dark:text-white">
                      {item?.attribute?.adminName}
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

          : null}
        <AccordionItem
          key={filterAdditionalData.length > 0 ? "3" : "2"}
          classNames={{
            title: "text-start",
            trigger: "cursor-pointer",
          }}
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
          {totalReview > 0 ? (
            <>
              <ReviewSection productId={productId} />
              <ReviewDetail
                reviewDetails={reviews}
                totalReview={totalReview}
              />
            </>
          ) : (
            <ReviewSection productId={productId} />
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
};
