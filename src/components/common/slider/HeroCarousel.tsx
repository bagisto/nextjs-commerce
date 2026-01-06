"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "@/components/theme/ui/grid/Tile";

export default function HeroCarousel({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const [current, setCurrent] = React.useState(0);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextSlide = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const buttonClassName =
    "flex h-full cursor-pointer items-center justify-center px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white";

  return (
    <>
      <div className="group relative overflow-hidden">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="group relative aspect-[1.2] h-full max-h-[738px] w-full overflow-hidden rounded-2xl"
        >
          <Image
            fill
            alt={images[current]?.altText as string}
             className={`h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105`}
            priority={true}
            sizes="(min-width: 1024px) 66vw, 100vw"
            src={images[current]?.src as string}
          />
        </motion.div>

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
     <ul className="fade-in my-3 flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden py-1 sm:my-7 lg:mb-0">
  {images.map((image, index) => {
    const isActive = index === current;

    return (
      <li
        key={image.src}
        className="relative aspect-square w-32 flex-shrink-0"
      >
        <button
          className="h-full w-full"
          onClick={() => {
            setCurrent(index);
          }}
        >
          <GridTileImage
            active={isActive}
            alt={image.altText}
            fill
            objectFit="cover"
            src={image.src}
          />
        </button>
      </li>
    );
  })}
</ul>

      ) : null}
    </>
  );
}
