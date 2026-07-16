"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React, { FC } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Prose from "@/components/theme/search/Prose";
import ReviewSection from "../review/ReviewSection";
import ReviewDetail, { ProductReviewEdge } from "../review/ReviewDetail";
import { AttributeValueNode } from "@/types/category/type";
import clsx from "clsx";

export const ProductMoreDetails: FC<{
  description: string;
  additionalData: AttributeValueNode[];
  productId: string;
  reviews: ProductReviewEdge[];
  totalReview: number;
  expandedKeys: Set<string>;
  setExpandedKeys: (keys: Set<string>) => void;
}> = ({ description, additionalData, reviews, productId, totalReview, expandedKeys, setExpandedKeys }) => {

  const filterAdditionalData = additionalData.filter((item) => item?.attribute?.isVisibleOnFront == "1");


  return (
    <div className="mt-7 sm:my-7">
      <Accordion
        itemClasses={{
          base: "shadow-none rounded-[8px] border-t-[1.5px] border-white dark:border-neutral-800 bg-[#00000008] dark:bg-neutral-800",
          title: "font-outfit text-[18px] font-normal leading-[100%] text-[#000000] dark:text-white",
          trigger: "px-[8px] pt-[24px] pb-[16px] cursor-pointer",
          content: "px-[8px] pb-[24px] text-[16px] leading-[100%] text-[#00000099] dark:text-selected-white",
        }}
        className="px-0 gap-4 flex flex-col"
        selectionMode="multiple"
        showDivider={false}
        variant="splitted"
        disableIndicatorAnimation
        selectedKeys={expandedKeys}
        onSelectionChange={(keys) => setExpandedKeys(keys as Set<string>)}
      >
        <AccordionItem
          key="1"
          indicator={({ isOpen }) => (
            <ChevronDownIcon
              className={clsx(
                "h-5 w-5 text-black dark:text-white transition-transform duration-300",
                isOpen ? "-rotate-180" : "rotate-0"
              )}
            />
          )}
          aria-label="Description"
          title="Description"
        >
          <Prose className="text-[#00000099] dark:text-selected-white font-normal font-outfit" html={description} />
        </AccordionItem>

        {filterAdditionalData.length > 0
          ?
          <AccordionItem
            key="2"
            indicator={({ isOpen }) => (
              <ChevronDownIcon
                className={clsx(
                  "h-5 w-5 text-black dark:text-white transition-transform duration-300",
                  isOpen ? "-rotate-180" : "rotate-0"
                )}
              />
            )}
            aria-label="Additional Information"
            title="Additional Information"
          >
            <div className="grid max-w-max grid-cols-[auto_1fr] gap-x-8 gap-y-4 px-1 pb-2">
              {filterAdditionalData?.map((item) => (
                <React.Fragment key={item.label}>
                  <div className="grid">
                    <p className="text-[16px] font-normal text-[#00000099] dark:text-selected-white font-outfit">
                      {item?.attribute?.adminName}
                    </p>
                  </div>
                  <div className="grid">
                    <p className="text-[16px] font-normal text-[#00000099] dark:text-selected-white font-outfit">
                      {item?.value || "--"}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </AccordionItem>

          : null}
        <AccordionItem
          id="ratings-section"
          key={filterAdditionalData.length > 0 ? "3" : "2"}
          indicator={({ isOpen }) => (
            <ChevronDownIcon
              className={clsx(
                "h-5 w-5 text-black dark:text-white transition-transform duration-300",
                isOpen ? "-rotate-180" : "rotate-0"
              )}
            />
          )}
          aria-label="Ratings"
          title="Ratings"
        >
          {totalReview > 0 ? (
            <>
              <ReviewDetail
                reviewDetails={reviews}
                totalReview={totalReview}
                productId={productId}
              />
            </>
          ) : (
            <ReviewSection productId={productId} totalReview={totalReview} />
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
};
