"use client";

import { ORDER_ID } from "@/utils/constants";
import { deleteCookie, getCookie } from "@utils/getCartToken";
import { extractNumericId } from "@utils/helper";
import { useEffect, useState } from "react";

export default function OrderDetail({ orderId: initialOrderId }: { orderId?: string }) {
  const [orderId] = useState<string | null>(
    () => initialOrderId ?? getCookie(ORDER_ID)
  );

  useEffect(() => {
    deleteCookie(ORDER_ID);
  }, []);

  const displayOrderId = orderId ? (extractNumericId(orderId) || orderId) : null;
  return (
    <div className="mb-8 font-outfit">
      <h1 className="my-2 text-center text-3xl font-semibold sm:text-4xl">
        Your order{" "}
        <span className="text-primary">
          #{displayOrderId ? displayOrderId : <span className="animate-pulse">...</span>}
        </span>{" "}
        has been placed successfully{" "}
      </h1>
      <p className="text-center text-lg font-normal text-black/60 dark:text-selected-white">
        Missing page, but your next favorite chair is just a click away.
      </p>
    </div>
  );
}
