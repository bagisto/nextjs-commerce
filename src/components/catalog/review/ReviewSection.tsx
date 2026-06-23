"use client";

import { useState } from "react";
import { Modal, ModalContent } from "@heroui/react";
import AddProductReview from "./AddProductReview";
import { ReviewButton } from "@components/common/button/ReviewButton";
import { NoReview } from "./NoReview";

interface ReviewSectionProps {
  productId: string;
  className?: string;
  totalReview: number;
}

export default function ReviewSection({
  productId,
  className,
  totalReview,
}: ReviewSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        {totalReview > 0 ? (
          <ReviewButton setShowForm={setOpen} className={`${className ?? ""}`} />
        ) : (
          <NoReview setShowForm={setOpen} />
        )}
      </div>

      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        backdrop="blur"
        size="4xl"
        hideCloseButton
        scrollBehavior="inside"
        placement="center"
        classNames={{
          wrapper: "z-[100] items-center justify-center",
          backdrop: "z-[99]",
          base: "bg-white dark:bg-neutral-900 rounded-xl mx-4 border border-neutral-200 dark:border-neutral-800 shadow-2xl",
        }}
      >
        <ModalContent className="p-0 border-none bg-white dark:bg-neutral-900">
          {(onClose) => (
            <AddProductReview
              productId={productId}
              onClose={onClose}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


