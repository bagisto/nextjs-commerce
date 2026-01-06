"use client";

import { useState } from "react";
import { Textarea } from "@heroui/react";
import { AddRatingStar } from "./AddRatingStar";
import { Button } from "@components/common/button/Button";
import { useCustomToast } from "@/utils/hooks/useToast";
import { useProductReview } from "@utils/hooks/useProductReview";
import Image from "next/image";

export default function AddProductReview({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) {
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      setReviewInfo((prev) => ({ ...prev, attachments: file.name }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const input: any = {
        productId: Number(productId.split("/").pop()),
        title: reviewInfo.title,
        comment: reviewInfo.comment,
        rating: reviewInfo.rating,
        name: "Guest User",
        email: "guest@mail.com",
      };
      if (imageFile) input.attachments = "";
      const fieldInputs = {
        input : {
          ...input
        }
      }
      await createProductReview(fieldInputs as any);
      setReviewInfo({
        title: "",
        comment: "",
        rating: 0,
        attachments: null,
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Failed to submit review. Please try again.", "danger");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto p-4 md:p-6 rounded-xl relative"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 -right-[9px] text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close review form"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image Upload */}
        <div className="space-y-4">
          {
            imagePreview ? (
              <div className="border-2 border-dashed border-gray-300  rounded-xl p-6 text-center transition-colors hover:border-primary-500">
                <div className="space-y-3">
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
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
              <div className="border-2 border-dashed border-gray-300  rounded-xl p-6 text-center transition-colors hover:border-primary-500">
                <div className="space-y-3">
                  <label
                    htmlFor="file-upload"
                    className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-2"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <div className="text-sm text-center">
                      <span className="font-medium text-primary-600">
                        Upload an image
                      </span>
                      <p className="text-xs">or drag and drop</p>
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
          {imageFile && (
            <p className="text-sm text-center">
              {imageFile}
            </p>
          )}
        </div>

        {/* Right Column - Review Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium  mb-1">
              Your Rating
            </label>
            <AddRatingStar
              value={reviewInfo.rating}
              onChange={(value) =>
                setReviewInfo((prev) => ({ ...prev, rating: value }))
              }
              size="size-7"
              className="mt-1"
            />
          </div>

          <Textarea
            label="Title"
            placeholder="Enter review title"
            labelPlacement="outside"
            value={reviewInfo.title}
            onChange={(e) =>
              setReviewInfo((prev) => ({ ...prev, title: e.target.value }))
            }
            minRows={1}
            maxRows={1}
            variant="bordered"
            classNames={{
              input: "text-base",
              label: "text-sm font-medium",
            }}
          />

          <Textarea
            label="Description"
            placeholder="Write your detailed review"
            labelPlacement="outside"
            value={reviewInfo.comment}
            onChange={(e) =>
              setReviewInfo((prev) => ({ ...prev, comment: e.target.value }))
            }
            minRows={5}
            variant="bordered"
            classNames={{
              input: "text-base",
              label: "text-sm font-medium",
            }}
          />

          <Button
            title={isLoading ? "Submitting..." : "Submit Review"}
            type="submit"
            disabled={isLoading}
            className="w-full mt-4"
          />
        </div>
      </div>
    </form>
  );
}
