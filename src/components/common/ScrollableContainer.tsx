"use client";

import React, { useRef, useEffect } from "react";

interface ScrollableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function ScrollableContainer({
  children,
  className,
  ...props
}: ScrollableContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {

    if (e.button !== 0) return;

    const container = containerRef.current;
    if (!container) return;

    isDragging.current = true;
    startX.current = e.pageX;
    scrollLeft.current = container.scrollLeft;
    dragDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const container = containerRef.current;
    if (!container) return;

    const x = e.pageX;
    const walk = x - startX.current;
    dragDistance.current = Math.abs(walk);


    if (dragDistance.current > 2) {
      e.preventDefault();
      container.style.cursor = "grabbing";
      container.style.userSelect = "none";
    }

    container.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    const container = containerRef.current;
    if (container) {
      container.style.removeProperty("cursor");
      container.style.removeProperty("user-select");
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {

      if (dragDistance.current > 5) {
        e.preventDefault();
        e.stopPropagation();
      }

      dragDistance.current = 0;
    };

    container.addEventListener("click", handleClick, true);

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {

        const isScrollable = container.scrollWidth > container.clientWidth;
        if (isScrollable) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }
      }
    };
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("click", handleClick, true);
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}
