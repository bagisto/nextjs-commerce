"use client";

import { useEffect } from "react";

export const ProductPageSkeleton = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto">
        <ProductDetailSkeleton />
        <RelatedProductSkeleton />
      </div>
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="flex flex-row gap-x-8">
      <div className="flex min-w-[878px] items-center justify-center">
        <div className="h-[736px] w-full animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-900" />
      </div>

      <div className="flex w-full flex-col space-y-6">
        <div className="h-12 w-full animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />
        <div className="h-12 w-1/2 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />
        <div className="flex justify-between">
          <div className="h-6 w-1/3 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />

          <div className="h-6 w-1/3 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />
        </div>
        <hr className="text-neutral-100 dark:text-neutral-900" />

        <div className="space-y-4">
          <div className="h-6 w-full animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-4 w-full animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-6 w-full animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-4 w-full animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-4 w-2/3 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />
        </div>
        <div className="flex gap-x-6">
          <div className="h-10 w-24 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-900" />
        </div>
        <div className="flex gap-x-6">
          <div className="h-12 w-32 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-12 w-48 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-900" />
        </div>

        <hr className="text-neutral-100 dark:text-neutral-900" />

        <div className="space-y-4">
          <div className="h-10 w-full animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-10 w-full animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-10 w-full animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900" />
        </div>
      </div>
    </div>
  );
};

export const RelatedProductSkeleton = () => {
  return (
    <div className="mt-20">
      <div className="flex flex-col">
        <div className="h-12 w-1/3 animate-pulse rounded-md bg-neutral-100 text-2xl font-semibold text-white dark:bg-neutral-900" />
        <div className="mt-4 h-6 w-1/2 animate-pulse rounded-md bg-neutral-100 text-2xl font-semibold text-white dark:bg-neutral-900" />
        <div className="mt-1 h-6 w-1/6 animate-pulse rounded-md bg-neutral-100 text-2xl font-semibold text-white dark:bg-neutral-900" />
      </div>

      <div className="mt-10 grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, index) => {
            return (
              <div key={index} className="animate-pulse">
                <div className="max-w-92.5 aspect-square w-full rounded-lg bg-neutral-100 dark:bg-neutral-900" />
                <div className="mt-4 h-6 w-3/4 rounded-md bg-neutral-100 dark:bg-neutral-900" />
                <div className="mt-2 h-4 w-1/2 rounded-md bg-neutral-100 dark:bg-neutral-900" />
              </div>
            );
          })}
      </div>
    </div>
  );
};
