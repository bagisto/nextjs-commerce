import clsx from "clsx";
import { RatingTypes } from "./type";
import StarIcon from "./icons/StarIcon";


export const Rating = ({
  length = 5,
  star = 0 ,
  size = "size-4",
  className,
  totalReview,
  reviewCount
}: RatingTypes) => {

    const rating = star ?? 0;
    const reviewCountToShow = reviewCount ?? totalReview;

 
  return (
    <div className={clsx("flex items-center gap-x-2", className)}>
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
        <span className="text-nowrap h-fit font-outfit text-sm font-light">
          ({reviewCountToShow} Review{reviewCountToShow !== 1 && reviewCountToShow !== 0 ? 's' : ''})
        </span>
    </div>
  );
};