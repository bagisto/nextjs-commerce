"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AddProductReview from "./AddProductReview";
import { Button } from "@components/common/button/Button";
import { NoReviewIcon } from "@components/common/icons/NoReviewsIcon";
import { getCookie } from "@utils/getCartToken";
import { IS_GUEST } from "@/utils/constants";

interface ReviewSectionProps {
    productId: string;
    reviews?: Array<any>; 
    totalReviews?: number;
}

export default function ReviewSection({ productId}: ReviewSectionProps) {
    const [showForm, setShowForm] = useState(false);
    if (showForm) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4 rounded-xl">
                <AddProductReview productId={productId} onClose={() => setShowForm(false)} />
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 rounded-xl">
                <div className="flex flex-col items-center gap-4 py-8">
                    <div className="flex flex-col items-center gap-4">
                        <NoReviewIcon />
                        <h2 className="font-outfit text-2xl font-semibold tracking-wide mt-4">Ratings</h2>
                        <p className="text-lg mt-2">No reviews yet. Be the first to share your experience</p>
                    </div>
                    <ReviewButton setShowForm={setShowForm} />
                </div>
        </div>
    );
}



export const ReviewButton = ({setShowForm , className}: {setShowForm: (show: boolean) => void, className?: string}) => {
    const IsGuest = getCookie(IS_GUEST);
    const router = useRouter();
    const handleAddReview = () => {
        if (IsGuest === "true" || IsGuest === null) {
            router.push("/customer/login");
        } else {
            setShowForm(true);
        }
    };

    return (
        <Button
                        title="Add a Review"
                        onClick={handleAddReview}
                        className={`relative flex w-full min-w-[18rem] max-w-[20rem] cursor-pointer h-fit items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white mt-6 ${className}`}
                    /> 
    )
    
}