"use client";

import { useMutation } from "@tanstack/react-query";
import { fetchHandler } from "../fetch-handler";
import { useCustomToast } from "./useToast";
import { isObject } from "@utils/type-guards";

interface AddInput {
    productId: number,
    title: string,
    comment: string,
    rating: number,
    name: string,
    email: string,
    attachments: string
}


export function useProductReview() {
    const { showToast } = useCustomToast();
    const { mutateAsync: createProductReview, isPending: isLoading } = useMutation({
        mutationFn: (input: AddInput) =>
            fetchHandler({
                url: "review",
                method: "POST",
                contentType: true,
                body: { ...input },
            }),

        onSuccess: (response) => {
            const responseData = response?.data?.createProductReview?.productReview;
            if (isObject(responseData)) {
                showToast("Product review created successfully", "success");
            }
        },

        onError: (error) => {
            console.error("Product review creation error:", error);
        },
    });


    return {
        createProductReview,
        isLoading,
    };
}
