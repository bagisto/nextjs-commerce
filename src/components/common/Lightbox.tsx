"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface LightboxProps {
  images: { src: string; altText: string }[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export default function Lightbox({
  images,
  index,
  open,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<Element | null>(null);

  const count = images.length;
  const goPrev = React.useCallback(
    () => onIndexChange((index - 1 + count) % count),
    [index, count, onIndexChange],
  );
  const goNext = React.useCallback(
    () => onIndexChange((index + 1) % count),
    [index, count, onIndexChange],
  );

  React.useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      (triggerRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, goPrev, goNext]);

  if (typeof document === "undefined") return null;

  const current = images[index];
  const duration = reduceMotion ? 0 : 0.2;

  return createPortal(
    <AnimatePresence>
      {open && current ? (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          ref={dialogRef}
          tabIndex={-1}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="absolute end-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-14 sm:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            {count > 1 ? (
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute start-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:start-4"
              >
                <ChevronLeftIcon className="h-6 w-6 rtl:rotate-180" />
              </button>
            ) : null}

            <motion.div
              key={current.src}
              className="relative h-full w-full"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration }}
            >
              <Image
                src={current.src}
                alt={current.altText}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>

            {count > 1 ? (
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="absolute end-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:end-4"
              >
                <ChevronRightIcon className="h-6 w-6 rtl:rotate-180" />
              </button>
            ) : null}
          </div>

          <div
            className="shrink-0 px-4 pb-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-sm text-white/80">
              <span className="line-clamp-1">{current.altText}</span>
              {count > 1 ? (
                <span className="mt-1 block text-white/60">
                  {index + 1} / {count}
                </span>
              ) : null}
            </p>

            {count > 1 ? (
              <ul className="mx-auto flex max-w-full flex-nowrap justify-start gap-2 overflow-x-auto py-1 sm:justify-center">
                {images.map((image, i) => (
                  <li key={image.src} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => onIndexChange(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-current={i === index}
                      className={`relative block h-16 w-16 overflow-hidden rounded-md border-2 transition ${
                        i === index
                          ? "border-white"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.altText}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
