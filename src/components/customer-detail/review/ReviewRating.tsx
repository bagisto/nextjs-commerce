import clsx from "clsx";
import StarIcon from "@/components/common/icons/StarIcon";

export const ReviewRating = ({ star }: { star: number }) => {
    return (
        <div className="flex w-[110px] h-[22px]">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="w-[22px] h-[22px] flex items-center justify-center">
                    <StarIcon
                        className={clsx(
                            "w-[16.5px] h-[15.4px]",
                            index < star
                                ? "fill-rating"
                                : "fill-border-muted dark:fill-selected-white"
                        )}
                    />
                </div>
            ))}
        </div>
    );
};
