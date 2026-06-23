import clsx from "clsx";
import { LeftArrow } from "@components/common/icons/LeftArrow";
import { Price } from "./Price";

const Label = ({
  title,
  amount,
  currencyCode,
  page,
  position = "bottom",
}: {
  title: string;
  amount: string;
  page?: string;
  currencyCode: string;
  position?: "bottom" | "center" | "left";
}) => {
  return (
    <div
      className={clsx("absolute w-fit px-4 ", {
        "bottom-0  pb-4": position === "center",
        "bottom-0 pb-5 md:pb-4": position === "bottom",
        "bottom-0 left-0  pb-4": position === "left",
      })}
    >
      <div
        className={`flex gap-5 items-center rounded-full border border-white bg-white/70 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white ${
          page === "category"
            ? "px-3 py-2 lg:px-5 lg:py-3"
            : "px-2 py-2 sm:px-3 lg:px-4 lg:py-3"
        }`}
      >
        <p
          className={` line-clamp-1 font-semibold leading-none tracking-tight ${clsx(
            page === "category"
              ? "text-sm md:text-xl"
              : "text-sm md:text-base"
          )}`}
        >
          {title}
        </p>
        {page === "category" ? (
          <button
            aria-label="Go back"
            className="cursor-pointer rounded-full bg-primary p-2 md:p-3 transition-transform duration-300 hover:translate-x-1"
          >
            <LeftArrow />
          </button>
        ) : (
          <Price
            amount={amount}
            className="flex-none rounded-full bg-primary p-1 md:p-2 text-sm text-white"
            currencyCode={currencyCode}
          />
        )}
      </div>
    </div>
  );
};

export default Label;
