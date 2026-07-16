"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image, { ImageProps } from "next/image";
import { useMediaQuery } from "@utils/hooks/useMediaQueryHook";

type ZoomMode = "inner" | "side";

interface ImageZoomProps extends Omit<ImageProps, "alt"> {
  alt: string;
 
  zoomLevel?: number;
  
  mode?: ZoomMode;
  
  lensSize?: number;
 
  sidePanelWidth?: number;
}


const ALLOWED_WIDTHS = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200,
  1920, 2048, 3840,
];

function getAllowedWidth(needed: number): number {
  const safe = Math.ceil(needed);
  const match = ALLOWED_WIDTHS.find((w) => w >= safe);
  return match ?? ALLOWED_WIDTHS[ALLOWED_WIDTHS.length - 1];
}

function getZoomSrc(src: string, zoomLevel: number, containerWidth: number): string {
  if (typeof src !== "string" || src === "") return "";
 
  if (src.startsWith("/_next/image") || !/^https?:\/\//.test(src)) return src;

  const needed = Math.max(1080, Math.min(3840, containerWidth * zoomLevel));
  const width = getAllowedWidth(needed);
 
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

export default function ImageZoom({
  src,
  alt,
  zoomLevel = 2.5,
  mode = "inner",
  lensSize = 180,
  sidePanelWidth = 480,
  className,
  ...props
}: ImageZoomProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isLoaded, setIsLoaded] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [lens, setLens] = useState({ x: 0, y: 0, visible: false });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [zoomLoaded, setZoomLoaded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    if (!isDesktop || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setImageSize({ width: rect.width, height: rect.height });
  }, [isDesktop]);

  const imageSrc = typeof src === "string" ? src : "";

  const zoomSrc = getZoomSrc(imageSrc, zoomLevel, imageSize.width);

 
  if (!isDesktop) {
    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    );
  }

  const captureSize = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setImageSize({ width: rect.width, height: rect.height });
  };

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (imageSize.width === 0) {
      setImageSize({ width: rect.width, height: rect.height });
    }

    if (mode === "inner") {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPos({
        x: Math.min(100, Math.max(0, x)),
        y: Math.min(100, Math.max(0, y)),
      });
      return;
    }

    // side mode
    let lensX = e.clientX - rect.left - lensSize / 2;
    let lensY = e.clientY - rect.top - lensSize / 2;
    lensX = Math.min(Math.max(lensX, 0), rect.width - lensSize);
    lensY = Math.min(Math.max(lensY, 0), rect.height - lensSize);
    setLens({ x: lensX, y: lensY, visible: true });
  };

  const handleEnter = (e: MouseEvent<HTMLDivElement>) => captureSize(e);
  const handleLeave = () => setLens((prev) => ({ ...prev, visible: false }));

  const baseImage = (
    <Image
      src={src}
      alt={alt}
      className={`pointer-events-none ${className ?? ""}`}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );

  
  if (mode === "inner") {
    return (
      <div
        ref={wrapperRef}
        className="group/zoom relative h-full w-full overflow-hidden cursor-zoom-in"
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
      >
        {baseImage}
        {isDesktop && zoomSrc && imageSize.width > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={zoomSrc}
            alt=""
            aria-hidden
            className="hidden"
            onLoad={() => setZoomLoaded(true)}
            onError={() => setZoomLoaded(false)}
          />
        )}
        {isLoaded && zoomSrc && (
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-150 group-hover/zoom:opacity-100"
            style={{
              backgroundImage: zoomLoaded ? `url('${zoomSrc}')` : undefined,
              backgroundColor: "transparent",
              backgroundRepeat: "no-repeat",
              backgroundSize: `${zoomLevel * 100}%`,
              backgroundPosition: `${pos.x}% ${pos.y}%`,
            }}
          />
        )}
      </div>
    );
  }

  
  return (
    <div
      className="group/zoom relative h-full w-full cursor-zoom-in"
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {baseImage}

      {isDesktop && zoomSrc && imageSize.width > 0 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={zoomSrc}
          alt=""
          aria-hidden
          className="hidden"
          onLoad={() => setZoomLoaded(true)}
          onError={() => setZoomLoaded(false)}
        />
      )}

      {isLoaded && lens.visible && zoomSrc && (
        <>
          <div
            className="pointer-events-none absolute z-20 border border-white/70 bg-white/20"
            style={{ left: lens.x, top: lens.y, width: lensSize, height: lensSize }}
          />
          <div
            className="pointer-events-none absolute left-full top-0 z-30 ml-4 hidden h-full border border-black/10 shadow-2xl lg:block"
            style={{
              width: sidePanelWidth,
              backgroundImage: zoomLoaded ? `url('${zoomSrc}')` : undefined,
              backgroundColor: "transparent",
              backgroundRepeat: "no-repeat",
              backgroundSize: `${imageSize.width * zoomLevel}px ${imageSize.height * zoomLevel}px`,
              backgroundPosition: `${-lens.x * zoomLevel}px ${-lens.y * zoomLevel}px`,
            }}
          />
        </>
      )}
    </div>
  );
}
