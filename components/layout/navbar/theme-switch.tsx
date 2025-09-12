"use client";

import { FC, useEffect, useState } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@heroui/switch";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

const ThemeSwitch: FC<ThemeSwitchProps> = ({ className, classNames }) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === "light" || isSSR,
    "aria-label": `Switch to ${
      theme === "light" || isSSR ? "dark" : "light"
    } mode`,
    onChange,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "flex size-9 lg:size-11 max-w-auto cursor-pointer items-center justify-center rounded-sm border border-solid border-neutral-200 transition-opacity  dark:border-neutral-700",
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
        {mounted ? (
          !isSelected || isSSR ? (
            <SunFilledIcon size={20} />
          ) : (
            <MoonFilledIcon size={20} />
          )
        ) : (
          <div className="h-5 w-5 rounded-full bg-gray-400 dark:bg-gray-700"></div>
        )}
      </div>
    </Component>
  );
};

export default ThemeSwitch;
