// src/components/common/Shimmer.tsx
"use client";

import { HTMLAttributes } from "react";

interface ShimmerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full" | "none";
  width?: string | number;
  height?: string | number;
}

export function Shimmer({
  className,
  rounded = "md",
  width = "100%",
  height = "100%",
  ...props
}: ShimmerProps) {
  const roundedClass = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
    none: "rounded-none",
  }[rounded];

  return (
    <div
      className={`
        relative overflow-hidden
        bg-gray-200 dark:bg-gray-700
        ${roundedClass}
        ${className}
      `}
      style={{ width, height }}
      {...props}
    >
      <div
        className={`
          absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]
          bg-gradient-to-r from-transparent via-white/30 to-transparent
        `}
      />
    </div>
  );
}