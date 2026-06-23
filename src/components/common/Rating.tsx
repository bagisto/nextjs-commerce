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
          <div className="flex gap-x-0.5 items-center">
            {Array.from({ length }).map((_, index) => (
              <StarIcon
                key={index}
                className={clsx(
                  size,
                  index < rating
                    ? "fill-yellow-500 dark:fill-yellow-500 stroke-transparent"
                    : "fill-black dark:fill-gray-900 dark:stroke-white"
                )}
              />
            ))}
          </div>
          {typeof reviewCountToShow === 'number' && reviewCountToShow >= 1 && (
            <span className="font-outfit text-[18px] font-normal leading-[100%] text-[#000000] dark:text-white">
              ({reviewCountToShow} {reviewCountToShow === 1 ? 'Review' : 'Reviews'})
            </span>
          )}
        </>
      ) : (
        <span
          className="text-sm text-primary dark:text-primary-soft underline cursor-pointer mb-4"
          onClick={onReviewClick}
        >
          Write a review
        </span>
      )}
    </div>
  );
};
