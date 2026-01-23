"use client";

import { FC, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shimmer } from "@/components/common/Shimmer";

interface ImageCarouselProps {
    options: {
        images: {
            image: string;
            link: string;
            title?: string;
        }[];
    };
}

const ImageCarousel: FC<ImageCarouselProps> = ({ options }) => {
    const { images } = options;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    const getFullImageUrl = useCallback((imagePath: string): string => {
        if (!imagePath) return "";
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        const backendUrl = process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT;
        if (!backendUrl) return "";

        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        const cleanBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

        return `${cleanBase}/${cleanPath}`;
    }, []);

    const startAutoplay = useCallback(() => {
        if (!images || images.length <= 1) return;

        autoplayRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
    }, [images]);

    const stopAutoplay = useCallback(() => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
    }, []);

    const handleDotClick = useCallback((index: number) => {
        setCurrentIndex(index);
        setIsPaused(true);
        stopAutoplay();

        setTimeout(() => {
            setIsPaused(false);
        }, 10000);
    }, [stopAutoplay]);

    useEffect(() => {
        if (!isPaused && images && images.length > 1) {
            startAutoplay();
        }
        return () => stopAutoplay();
    }, [isPaused, images, startAutoplay, stopAutoplay]);

    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const mouseStartX = useRef<number | null>(null);
    const mouseEndX = useRef<number | null>(null);

    if (!Array.isArray(images) || images.length === 0) return null;

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        touchEndX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const distance = touchStartX.current - touchEndX.current;
            if (distance > 50) {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            } else if (distance < -50) {
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
            }
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        mouseStartX.current = e.clientX;
    };
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        mouseEndX.current = e.clientX;
        if (mouseStartX.current !== null && mouseEndX.current !== null) {
            const distance = mouseStartX.current - mouseEndX.current;
            if (distance > 50) {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            } else if (distance < -50) {
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
            }
        }
        mouseStartX.current = null;
        mouseEndX.current = null;
    };

    return (
        <section className="mt-7.5 w-full">
            <div
                className="group relative w-full overflow-hidden rounded-xl md:rounded-2xl aspect-[1.97/1]"
                style={{
                    position: 'relative',
                    width: '100%'
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                {images.map((img, index) => {
                    const imageUrl = getFullImageUrl(img.image);
                    const isActive = index === currentIndex;
                    const altText = img.title || `Banner ${index + 1}`;

                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-100 z-0" : "opacity-0 z-0"}`}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            {img.link ? (
                                <Link
                                    href={`/search/${img.link}`}
                                    className="block h-full w-full"
                                    aria-label={`View ${altText}`}
                                >
                                    <div className="relative h-full w-full">
                                        <Shimmer className="h-full w-full" />
                                        <Image
                                            src={imageUrl}
                                            alt={altText}
                                            fill
                                            className="object-cover !z-0"
                                            priority={index === 0}
                                            sizes="100vw"
                                        />
                                    </div>
                                </Link>
                            ) : (
                                <div className="relative h-full w-full">
                                    <Shimmer className="h-full w-full" />
                                    <Image
                                        src={imageUrl}
                                        alt={altText}
                                        fill
                                        className="object-cover !z-0"
                                        priority={index === 0}
                                        sizes="100vw"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}

                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 z-0 flex -translate-x-1/2 gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm md:bottom-6">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex
                                    ? "w-8 bg-white"
                                    : "w-2.5 bg-white/50 hover:bg-white/80 hover:w-4"
                                    }`}
                                type="button"
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={index === currentIndex}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ImageCarousel;