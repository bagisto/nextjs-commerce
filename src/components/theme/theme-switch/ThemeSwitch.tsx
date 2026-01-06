"use client";

import { FC } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@heroui/switch";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { MoonFilledIcon, SunFilledIcon } from "@/components/common/icons/product-icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

const ThemeSwitch: FC<ThemeSwitchProps> = ({ className, classNames }) => {
  const { setTheme, resolvedTheme } = useTheme();

  const isReady = resolvedTheme !== undefined;
  const isDark = resolvedTheme === "dark";

  const onChange = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  };

  const {
    Component,
    slots,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: isDark,
    "aria-label": `Switch to ${isDark ? "light" : "dark"} mode`,
    onChange,
  });

  if (!isReady) {
    return null; 
  }

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "flex size-9 lg:size-11 max-w-auto cursor-pointer items-center justify-center rounded-sm border border-solid border-neutral-200 transition-opacity dark:border-neutral-700",
          className,
          classNames?.base
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>

      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "mx-0 h-auto w-auto rounded-lg bg-transparent px-0 pt-px",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "fill-black/60 stroke-black/60 dark:stroke-white/60 dark:fill-white/60",
            ],
            classNames?.wrapper
          ),
        })}
      >
        {isDark ? <SunFilledIcon size={20} /> : <MoonFilledIcon size={20} />}
      </div>
    </Component>
  );
};

export default ThemeSwitch;
