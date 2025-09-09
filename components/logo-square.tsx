import clsx from "clsx";

import LogoIcon from "./icons/logo";

export default function LogoSquare({
  size = "sm",
}: {
  size?: "sm" | "medium" | "large";
}) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black",
        {
          "h-[40px] w-[40px] rounded-xl": size === "medium",
          "h-[30px] w-[30px] rounded-lg": size === "sm",
        },
      )}
    >
      <LogoIcon />
    </div>
  );
}
