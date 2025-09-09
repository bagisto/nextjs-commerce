"use client";

import { getLocalStorage, ORDER_DETAILS } from "@/store/local-storage";

export default function OrderDetail() {
  const getOrder = getLocalStorage(ORDER_DETAILS, true);

  return (
    <div className="mb-8 font-outfit">
      <h1 className="my-2 text-center text-3xl font-semibold sm:text-4xl">
        Your order <span className="text-primary">#{getOrder?.order?.id}</span>{" "}
        has been placed successfully{" "}
      </h1>
      <p className="text-center text-lg font-normal text-black/60 dark:text-neutral-300">
        Missing page, but your next favorite chair is just a click away.
      </p>
    </div>
  );
}
