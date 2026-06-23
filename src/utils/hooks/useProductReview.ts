"use client";

import { useMutation } from "@apollo/client/react";
import { CREATE_PRODUCT_REVIEW } from "@/graphql";
import { useCustomToast } from "./useToast";
import { CreateProductReviewInput, ProductReviewResponse } from "@/types/review";

export function useProductReview() {
    const { showToast } = useCustomToast();

    const [mutateAsync, { loading: isLoading, error }] = useMutation<ProductReviewResponse>(CREATE_PRODUCT_REVIEW, {
        onCompleted: (response) => {
            const responseData = response?.createProductReview;
            if (responseData) {
                showToast("Product review created successfully", "success");
            }
        },
        onError: (error) => {
            showToast(error.message, "danger");
        },
    });

    const createProductReview = async (input: CreateProductReviewInput) => {
        return await mutateAsync({
            variables: {
                input: {
                    productId: input.productId,
                    title: input.title,
                    comment: input.comment,
                    rating: input.rating,
                    name: input.name,
                    email: input.email,
                    attachments: input.attachments || "",
                },
            },
        });
    };

    return {
        createProductReview,
        isLoading,
        error
    };
}
