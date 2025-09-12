import clsx from "clsx";

import StarIcon from "@/components/icons/star-icon";
export interface RatingTypes {
  length: number;
  star: number;
  reviewCount?: number;
  size?: string;
  className?: string;
  totalReview?: number;
}
const Rating = ({
  length,
  star = 4,
  size = "size-4",
  className,
  totalReview,
}: RatingTypes) => {
  if (!star) {
    return null;
  }

  return (
    <div className={`${clsx("flex items-center gap-x-2", className)}`}>
      <div className="flex gap-x-0.5">
        {Array.from({ length: length }).map((_, index) => (
          <StarIcon
            key={index}
            className={`${
              index < star
                ? "fill-yellow-500 dark:stroke-yellow-500"
                : "fill-gray-900 dark:stroke-white"
            } ${size}`}
          />
        ))}
      </div>
      {totalReview ? (
        <span className="text-nowrap h-fit font-outfit text-sm font-light">{`(${totalReview} Reviews)`}</span>
      ) : null}
    </div>
  );
};

export default Rating;
