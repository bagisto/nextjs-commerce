"use client";

import { useState } from "react";
import Image from "next/image";
import { NOT_IMAGE } from "@/utils/constants";
import { NextImageProps } from "./type";


export function NextImage({
  src,
  alt,
  className = "",
  width,
  height,
  sizes = "100vw",
  priority = false,
}: NextImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const finalSrc = failed || !src ? NOT_IMAGE : src;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      {/* IMAGE */}
      <Image
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`transition-opacity duration-300 object-cover w-full h-full
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
      />

      {!loaded && (
        <div className="absolute inset-0 bg-neutral-200" />
      )}
    </div>
  );
}
