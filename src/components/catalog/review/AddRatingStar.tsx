"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { StarIcon } from "@heroicons/react/24/solid";
import { RatingTypes } from "../type";


export const AddRatingStar = ({
    length = 5,
    value,
    size = "size-6",
    className,
    onChange
}: RatingTypes) => {

    const [internalValue, setInternalValue] = useState(value ?? 0);
    const [hovered, setHovered] = useState<number | null>(null);

    useEffect(() => {
        if (value !== undefined) {
              // eslint-disable-next-line react-hooks/set-state-in-effect
            setInternalValue(value);
        }
    }, [value]);

    const currentValue = value ?? internalValue;

    const getFillState = (index: number) => {
        if (hovered !== null) return index <= hovered;
        return index <= currentValue;
    };

    const handleClick = (index: number) => {
        if (value === undefined) {
              // eslint-disable-next-line react-hooks/set-state-in-effect
            setInternalValue(index);
        }
        onChange?.(index);
    };


    return (
        <div className={clsx("flex items-center gap-x-1 cursor-pointer", className)}>
            {Array.from({ length }).map((_, i) => {
                const index = i + 1;
                return (
                    <StarIcon
                        key={index}
                        onClick={() => handleClick(index)}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                        fill="currentColor"
                        className={clsx(
                            "fill-current",
                            size || "size-6",
                            getFillState(index)
                                ? "text-yellow-500"
                                : "text-gray-300",
                            "transition-colors"
                        )}
                    />
                );
            })}
        </div>
    );
};

