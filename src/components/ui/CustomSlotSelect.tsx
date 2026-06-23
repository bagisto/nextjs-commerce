"use client";

import React, { useState } from "react";
import { ChevronDownIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";

interface SlotOption {
    label: string;
    value: string;
}

interface CustomSlotSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: SlotOption[];
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    style?: React.CSSProperties;
    showClockIcon?: boolean;
}

export const CustomSlotSelect: React.FC<CustomSlotSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = "Select Slot",
    disabled = false,
    loading = false,
    className = "",
    style,
    showClockIcon = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedLabel = options.find(o => o.value === value)?.label || "";
    const displayPlaceholder = loading ? "Loading Slots..." : placeholder;

    const handleSelect = (opt: SlotOption) => {
        onChange(opt.value);
        setIsOpen(false);
    };

    return (
        <Popover
            isOpen={isOpen && !disabled && options.length > 0}
            onOpenChange={(open) => {
                if (!disabled && (options.length > 0 || !open)) setIsOpen(open);
            }}
            placement="bottom-start"
            offset={4}
            classNames={{
                content: "p-0 shadow-2xl border-0 rounded-2xl overflow-hidden"
            }}
        >
            <PopoverTrigger>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        if (!disabled && options.length > 0) setIsOpen(o => !o);
                    }}
                    className={`
                        relative flex items-center w-full text-left
                        bg-white dark:bg-zinc-900
                        border border-overlay-strong dark:border-white/20
                        rounded-md transition-all outline-none
                        focus:border-primary
                        disabled:cursor-not-allowed disabled:opacity-50
                        font-outfit font-normal text-base
                        ${isOpen ? "border-primary" : ""}
                        ${className}
                    `}
                    style={{
                        height: "48px",
                        paddingLeft: "16px",
                        paddingRight: "44px",
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        ...style,
                    }}
                >
                    <span className={selectedLabel ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500 truncate"}>
                        {selectedLabel || displayPlaceholder}
                    </span>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        {loading ? (
                            <svg className="w-4 h-4 text-neutral-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : showClockIcon ? (
                            <ClockIcon className="w-5 h-5 text-neutral-400" />
                        ) : (
                            <ChevronDownIcon className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        )}
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-zinc-700/50 overflow-hidden w-[240px] max-h-[280px] flex flex-col">
                    <div className="px-4 py-3 border-b border-neutral-100 dark:border-zinc-700/50 shrink-0">
                        <span className="font-outfit font-semibold text-13 text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                            {showClockIcon ? "Select Time" : "Select Slot"}
                        </span>
                    </div>

                    <div className="overflow-y-auto py-1.5 scrollbar-hide">
                        {options.length === 0 ? (
                            <div className="px-4 py-4 text-center font-outfit text-13 text-neutral-400">
                                No slots available
                            </div>
                        ) : (
                            options.map((opt, i) => {
                                const isSelected = opt.value === value;
                                return (
                                    <button
                                        key={opt.value ?? i}
                                        type="button"
                                        onClick={() => handleSelect(opt)}
                                        className={`
                                            w-full flex items-center justify-between px-4 py-2.5 text-left
                                            font-outfit text-sm font-normal transition-all
                                            ${isSelected
                                                ? "bg-blue-50 dark:bg-blue-900/20 text-accent font-medium"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-zinc-800 cursor-pointer"
                                            }
                                        `}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default CustomSlotSelect;
