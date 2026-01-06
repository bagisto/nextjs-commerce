"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AddProductReview from "./AddProductReview";
import { Button } from "@components/common/button/Button";
import StarIcon from "@components/common/icons/StarIcon";
import { getCookie } from "@utils/getCartToken";
import { IS_GUEST } from "@/utils/constants";

export default function ReviewSection({ productId }: { productId: string }) {
    const [showForm, setShowForm] = useState(false);
    const IsGuest = getCookie(IS_GUEST);
    const router = useRouter();

    const handleAddReview = () => {
        if (IsGuest === "true") {
            router.push("/customer/login");
        } else {
            setShowForm(true);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 rounded-xl">
            {!showForm ? (
                <div className="flex flex-col items-center gap-4">
                    <StarIcon className="size-16 fill-yellow-300" />
                    <p className="text-gray-500 text-lg font-medium">No Reviews Yet</p>
                    <Button
                        title="Add Review"
                        onClick={handleAddReview}
                        className="mx-auto"
                    />
                </div>
            ) : (
                <div>
                    <AddProductReview productId={productId} onClose={() => setShowForm(false)} />
                </div>
            )}
        </div>
    );
}
