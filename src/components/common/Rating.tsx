import clsx from "clsx";
import { RatingTypes } from "./type";
import StarIcon from "./icons/StarIcon";

export const Rating = ({
  length = 5,
  star = 0,
  size = "size-4",
  className,
  reviewCount,
  onReviewClick,
}: RatingTypes) => {
  const rating = star ?? 0;
  const reviewCountToShow = reviewCount ?? star > 0;

  return (
   <div className={clsx("flex items-center gap-x-2", className)}>
  {reviewCountToShow ? (
    <>
  <div className="flex gap-x-0.5">
    {Array.from({ length }).map((_, index) => (
      <StarIcon
        key={index}
        className={clsx(
          size,
          index < rating
            ? "fill-yellow-500 dark:fill-yellow-500"
            : "fill-black dark:fill-gray-900",
          "fill-black dark:stroke-white"
        )}
      />
    ))}
  </div>
    <span className="text-sm text-gray-600 dark:text-gray-400">
      ({reviewCountToShow} {reviewCountToShow === 1 ? 'Review' : 'Reviews'})
    </span>
    </>
  ) : (
    <span 
    className="text-sm text-blue-600 underline cursor-pointer"
    onClick={onReviewClick}
    >
      Write a review
    </span>
  )}
</div>
  );
};
