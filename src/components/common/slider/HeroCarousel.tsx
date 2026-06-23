"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "@/components/theme/ui/grid/Tile";
import { Shimmer } from "@/components/common/Shimmer";
import {
  HeroCarouselShimmer,
  HeroCarouselThumbnailShimmer,
} from "./HeroCarouselShimmer";

export default function HeroCarousel({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const [current, setCurrent] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);


  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const scrollRef = React.useRef<HTMLUListElement>(null);


  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);
  const dragDistance = React.useRef(0);

  const prevSlide = () => {
    setIsLoading(true);
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIsLoading(true);
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const checkScrollLimits = React.useCallback(() => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft: sLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(sLeft > 2);
      setCanScrollRight(sLeft < scrollWidth - clientWidth - 2);
    }
  }, []);


  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollLimits();

    const handleScroll = () => {
      checkScrollLimits();
    };

    const handleResize = () => {
      checkScrollLimits();
    };

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);


    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [checkScrollLimits, images.length]);


  React.useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const activeChild = container.children[current] as HTMLElement;
      if (activeChild) {
        const containerWidth = container.clientWidth;
        const childLeft = activeChild.offsetLeft;
        const childWidth = activeChild.clientWidth;
        container.scrollTo({
          left: childLeft - containerWidth / 2 + childWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [current]);


  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollRef.current;
    if (!container) return;
    isDragging.current = true;
    startX.current = e.pageX;
    scrollLeft.current = container.scrollLeft;
    dragDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const container = scrollRef.current;
    if (!container) return;
    const x = e.pageX;
    const walk = (x - startX.current);
    dragDistance.current = Math.abs(walk);
    container.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const handleThumbnailClick = (e: React.MouseEvent, index: number) => {
    if (dragDistance.current > 5) {
      e.preventDefault();
      return;
    }
    setCurrent(index);
  };

  const scrollLeftBtn = () => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({
        left: -container.clientWidth * 0.6,
        behavior: "smooth",
      });
    }
  };

  const scrollRightBtn = () => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({
        left: container.clientWidth * 0.6,
        behavior: "smooth",
      });
    }
  };

  if (!images || images.length === 0) {
    return (
      <>
        <HeroCarouselShimmer />
        <HeroCarouselThumbnailShimmer count={3} />
      </>
    );
  }
  const buttonClassName =
    "flex h-full cursor-pointer items-center justify-center px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white";

  return (
    <>
      <div className="group relative overflow-hidden">
        <div
          key={current}
          className="group relative h-full max-h-[738px] w-full overflow-hidden rounded-2xl transition-opacity duration-600 ease-in-out"
          style={{
            aspectRatio: "380/316",
          }}
        >
          <div className="relative h-full w-full">
            {isLoading && (
              <Shimmer
                className="absolute inset-0 z-10 h-full w-full"
                rounded="lg"
              />
            )}
            <Image
              fill
              alt={images[current]?.altText as string}
              className={`h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105 ${isLoading ? "opacity-0" : "opacity-100"
                }`}
              priority={true}
              sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 66vw, 1000px"
              src={images[current]?.src as string}
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>
        </div>

        {images?.length > 1 ? (
          <div className="absolute bottom-[5%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-gray-500/70 bg-gray-500/70 text-white/80 backdrop-blur transition-all duration-300 dark:border-black dark:bg-neutral-900/80">
              <button
                aria-label="Previous image"
                className={buttonClassName}
                onClick={prevSlide}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-white/80" />
              <button
                aria-label="Next image"
                className={buttonClassName}
                onClick={nextSlide}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {images?.length > 1 ? (
        <div className="relative group/thumbs w-full">
          {canScrollLeft && (
            <div className="absolute left-1 top-0 bottom-0 z-10 flex items-center justify-start pointer-events-none w-12">
              <button
                type="button"
                onClick={scrollLeftBtn}
                className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 bg-white/95 text-neutral-800 shadow-md hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all dark:border-neutral-800 dark:bg-neutral-900/95 dark:text-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
                aria-label="Scroll thumbnails left"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
            </div>
          )}


          {canScrollRight && (
            <div className="absolute right-1 top-0 bottom-0 z-10 flex items-center justify-end pointer-events-none w-12">
              <button
                type="button"
                onClick={scrollRightBtn}
                className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 bg-white/95 text-neutral-800 shadow-md hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all dark:border-neutral-800 dark:bg-neutral-900/95 dark:text-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
                aria-label="Scroll thumbnails right"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          <ul
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="fade-in my-3 flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden py-1 sm:my-7 lg:mb-0 select-none no-scrollbar cursor-grab active:cursor-grabbing scroll-smooth"
          >
            {images.map((image, index) => {
              const isActive = index === current;

              return (
                <li
                  key={image.src}
                  className="relative aspect-square w-16 md:w-32 flex-shrink-0"
                >
                  <button
                    className="h-full w-full pointer-events-auto cursor-pointer"
                    onClick={(e) => handleThumbnailClick(e, index)}
                  >
                    <GridTileImage
                      active={isActive}
                      alt={image.altText}
                      fill
                      objectFit="cover"
                      draggable={false}
                      src={image.src}
                      sizes="(max-width: 768px) 16vw, 10vw"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : isLoading ? (
        <div className="my-3 sm:my-7 lg:mb-0">
          <div className="relative aspect-square w-16 md:w-32">
            <Shimmer className="h-full w-full" rounded="lg" />
          </div>
        </div>
      ) : null}
    </>
  );
}

