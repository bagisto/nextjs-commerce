"use client";

import { useState } from "react";
import Image from "next/image";
import { NOT_IMAGE } from "@/utils/constants";
import { NextImageProps } from "./type";
import { Shimmer } from "./Shimmer";

export function NextImage({
  src,
  alt,
  className = "",
  width,
  height,
  sizes = "100vw",
  priority = false,
}: NextImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const finalSrc = hasError || !src ? NOT_IMAGE : src;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      {!isLoaded && (
        <Shimmer
          className="absolute inset-0 z-0"
          width="100%"
          height="100%"
          rounded="lg"
        />
      )}

      <Image
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`transition-opacity duration-300 object-cover w-full h-full ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}