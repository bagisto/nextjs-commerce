"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

import Label from "../Label";
import { NOT_IMAGE } from "@/utils/constants";

export function GridTileImage({
  active,
  label,
  src,
  alt,
  className,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    page?: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center" | "left";
  };
} & React.ComponentProps<typeof Image>) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src as string);
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadDone = () => {
    setTimeout(() => {
      if (!src) {
        setImgSrc(NOT_IMAGE);
      }
    }, 500);
    setLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setImgSrc(NOT_IMAGE);
  };
  return (
    <div
      className={clsx(
        "group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg dark:bg-black",
        active ? "border-2 border-blue-600 " : " border-2 border-transparent",
        {
          relative: label,
        }
      )}
    >
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={alt ?? ""}
          placeholder="blur"
          blurDataURL={NOT_IMAGE}
          onError={handleError}
          priority
          onLoad={loadDone}
          {...props}
          className={clsx(
            "duration-700 truncate h-full transition group-hover:scale-105 w-full object-contain ease-in-out align-[none]",
            hasError ? "bg-contain!" : "",
            isLoading
              ? "grayscale blur-2xl rounded-md truncate"
              : "grayscale-0 blur-0",
            className
          )}
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-gray-100" />
      )}

      {label ? (
        <Label
          amount={label.amount}
          currencyCode={label.currencyCode}
          page={label.page}
          position={label.position}
          title={label.title}
        />
      ) : null}
    </div>
  );
}
