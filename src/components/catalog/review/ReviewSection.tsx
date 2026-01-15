"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AddProductReview from "./AddProductReview";
import { Button } from "@components/common/button/Button";
import { getCookie } from "@utils/getCartToken";
import { IS_GUEST } from "@/utils/constants";

export default function ReviewSection({ productId }: { productId: string }) {
    const [showForm, setShowForm] = useState(false);
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
        <div className="w-full max-w-4xl mx-auto p-4 rounded-xl">
            {!showForm ? (
                <div className="flex flex-col items-center gap-4">
                    <Button
                        title="Add Review"
                        onClick={handleAddReview}
                        className="relative flex w-full max-w-[20rem] cursor-pointer h-fit items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white"
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
