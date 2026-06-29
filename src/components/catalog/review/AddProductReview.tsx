"use client";

import { useState } from "react";
import { Textarea } from "@heroui/react";
import { AddRatingStar } from "./AddRatingStar";
import { Button } from "@components/common/button/Button";
import { useCustomToast } from "@utils/hooks/useToast";
import { useProductReview } from "@utils/hooks/useProductReview";
import Image from "next/image";

import { CreateProductReviewInput } from "@/types/review";
import { AddUploadImage } from "@components/common/icons/AddUploadImage";

export default function AddProductReview({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) {
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    title: "",
    comment: "",
    rating: "",
  });
  const [reviewInfo, setReviewInfo] = useState({
    title: "",
    comment: "",
    rating: 0,
    attachments: null as string | null,
  });
  const { showToast } = useCustomToast();
  const { createProductReview, isLoading } = useProductReview();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setReviewInfo((prev) => ({ ...prev, attachments: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: "",
      comment: "",
      rating: "",
    };

    if (!reviewInfo.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!reviewInfo.comment.trim()) {
      newErrors.comment = "Comment is required";
    }

    if (reviewInfo.rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    setErrors(newErrors);

    if (newErrors.title || newErrors.comment || newErrors.rating) {
      showToast("Please fill in all required fields", "danger");
      return;
    }

    try {
      const input: CreateProductReviewInput = {
        productId: Number(productId.split("/").pop()),
        title: reviewInfo.title,
        comment: reviewInfo.comment,
        rating: reviewInfo.rating,
        name: "Guest User",
        email: "guest@mail.com",
        attachments: reviewInfo.attachments ? JSON.stringify([reviewInfo.attachments]) : "",
      };

      await createProductReview(input);

      setReviewInfo({
        title: "",
        comment: "",
        rating: 0,
        attachments: null,
      });
      setImageFile(null);
      setImagePreview(null);
      setErrors({
        title: "",
        comment: "",
        rating: "",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Failed to submit review. Please try again.", "danger");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto p-4 md:p-6 rounded-xl relative bg-white dark:bg-neutral-900 text-black dark:text-white"
    >
      <div className="flex mb-4">
        <h1 className="text-xl font-semibold text-black dark:text-white">Write a review</h1>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-500 hover:text-gray-700 dark:text-selected-white dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Close review form"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="space-y-4">
          {imagePreview ? (
            <div className="border-2 w-[120px] h-auto max-h-[120px] border-dashed border-gray-300 dark:border-neutral-700 rounded-xl text-center transition-colors hover:border-primary-500">
              <div className="space-y-3">
                <div className="relative mx-auto">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-neutral-700 w-32 h-32 rounded-xl p-6 text-center transition-colors hover:border-primary-500">
              <div>
                <label
                  htmlFor="file-upload"
                  className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-2"
                >
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full">
                    <AddUploadImage />
                  </div>

                  <div className="text-sm text-center">
                    <span className="font-medium text-black dark:text-white">Add Image</span>
                  </div>

                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          )}
          {imageFile && <p className="text-sm text-black/80 dark:text-selected-white">{imageFile}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-base font-semibold text-black dark:text-white mb-1">
              Rating
            </label>
            <AddRatingStar
              value={reviewInfo.rating}
              onChange={(value) => {
                setReviewInfo((prev) => ({ ...prev, rating: value }));
                setErrors((prev) => ({ ...prev, rating: "" }));
              }}
              size="size-6"
              className="mt-1"
            />
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          <Textarea
            label="Title"
            placeholder="Title"
            labelPlacement="outside"
            value={reviewInfo.title}
            onChange={(e) => {
              setReviewInfo((prev) => ({ ...prev, title: e.target.value }));
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            minRows={1}
            maxRows={1}
            variant="bordered"
            isInvalid={!!errors.title}
            errorMessage={errors.title}
            classNames={{
              input: "text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-selected-white",
              label: "px-2 text-base font-semibold text-black dark:text-white",
              inputWrapper: "border-gray-300 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-600 focus-within:!border-black dark:focus-within:!border-white bg-transparent",
            }}
          />

          <Textarea
            label="Comment"
            placeholder="Comment"
            labelPlacement="outside"
            value={reviewInfo.comment}
            onChange={(e) => {
              setReviewInfo((prev) => ({ ...prev, comment: e.target.value }));
              setErrors((prev) => ({ ...prev, comment: "" }));
            }}
            minRows={5}
            variant="bordered"
            isInvalid={!!errors.comment}
            errorMessage={errors.comment}
            classNames={{
              input: "text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-selected-white",
              label: "px-2 text-base font-semibold text-black dark:text-white",
              inputWrapper: "border-gray-300 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-600 focus-within:!border-black dark:focus-within:!border-white bg-transparent",
            }}
          />
          <div className="w-32">
            <Button
              title={isLoading ? "Submitting..." : "Submit"}
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 rounded-2xl"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
