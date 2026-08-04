"use client";

import clsx from "clsx";
import Image from "next/image";
import { useCallback, useState } from "react";

import Label from "../Label";
import { NOT_IMAGE } from "@/utils/constants";
import { Shimmer } from "@/components/common/Shimmer";

export function GridTileImage({
  active,
  label,
  src,
  alt,
  className,
  rounded = "rounded-lg",
  onLoad,
  onError,
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
  rounded?: string;
} & React.ComponentProps<typeof Image>) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src as string);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadDone: React.ReactEventHandler<HTMLImageElement> = (e) => {
    if (!src) {
      setImgSrc(NOT_IMAGE);
    }
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setHasError(true);
    setImgSrc(NOT_IMAGE);
    setIsLoaded(true);
    onError?.(e);
  };

  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div
      className={clsx(
        "group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden dark:bg-black",
        rounded,
        active ? "ring-2 ring-primary ring-inset" : "",
        {
          relative: label,
        }
      )}
    >
      {!isLoaded && (
        <Shimmer
          className="absolute inset-0 z-0"
          width="100%"
          height="100%"
          rounded="lg"
        />
      )}

      {imgSrc ? (
        <Image
          ref={imgRef}
          src={imgSrc}
          alt={alt ?? ""}
          placeholder="blur"
          blurDataURL={NOT_IMAGE}
          {...props}
          onError={handleError}
          onLoad={loadDone}
          className={clsx(
            "duration-700 truncate h-full transition group-hover:scale-105 w-full object-cover ease-in-out",
            hasError ? "bg-contain!" : "",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
        />
      ) : (
        <div className="h-full w-full" />
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