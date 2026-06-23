import { IS_GUEST } from "@utils/constants";
import { getCookie } from "@utils/getCartToken";
import { useRouter } from "next/navigation";

export const ReviewButton = ({ setShowForm, className }: { setShowForm: (show: boolean) => void, className?: string }) => {
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
        <button
            onClick={handleAddReview}
            className={`relative flex w-full min-w-[18rem] max-w-[20rem] cursor-pointer h-fit items-center justify-center rounded-full bg-primary  p-4 tracking-wide text-white mt-6 mb-[8px] ${className}`}
        > 
            Write a review
        </button>
    )

}