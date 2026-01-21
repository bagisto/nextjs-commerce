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
  const [_isLoading, setLoading] = useState(true);
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
        "group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg dark:bg-black",
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
          onLoad={loadDone}
          {...props}
          className={clsx(
            "duration-700 truncate h-full transition group-hover:scale-105 w-full object-cover ease-in-out",
            hasError ? "bg-contain!" : "",
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
