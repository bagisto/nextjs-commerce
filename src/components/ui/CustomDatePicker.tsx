"use client";

import React, { useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";

interface CustomDatePickerProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    minDate?: string;
    maxDate?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    triggerClassName?: string;
    placeholderClassName?: string;
    displayFormat?: "default" | "DD/MM/YYYY";
    showClearIcon?: boolean;
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDate(val: string): Date | null {
    if (!val) return null;
    const [y, m, d] = val.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function formatDisplayDate(val: string, format: "default" | "DD/MM/YYYY" = "default"): string {
    if (!val) return "";
    const d = parseDate(val);
    if (!d) return val;
    if (format === "DD/MM/YYYY") {
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    value,
    onChange,
    placeholder = "Select Date",
    minDate,
    maxDate,
    disabled = false,
    className = "",
    style,
    triggerClassName = "",
    placeholderClassName = "",
    displayFormat = "default",
    showClearIcon = true,
}) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = parseDate(value);

    const initDate = selectedDate || today;
    const [viewYear, setViewYear] = useState(initDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(initDate.getMonth());
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<"month" | "year" | null>(null);


    const minD = minDate ? parseDate(minDate) : null;
    const maxD = maxDate ? parseDate(maxDate) : null;

    const isDayDisabled = (date: Date) => {
        if (minD && date < minD) return true;
        if (maxD && date > maxD) return true;
        return false;
    };

    const prevMonth = () => {
        setOpenDropdown(null);
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        setOpenDropdown(null);
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const currentYear = today.getFullYear();
    const minYear = minD ? minD.getFullYear() : currentYear - 120;
    const maxYear = maxD ? maxD.getFullYear() : currentYear + 10;
    const yearOptions: number[] = [];
    for (let y = maxYear; y >= minYear; y--) yearOptions.push(y);

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const calendarCells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarCells.push(new Date(viewYear, viewMonth, d));
    while (calendarCells.length % 7 !== 0) calendarCells.push(null);

    const handleDayClick = (date: Date) => {
        if (isDayDisabled(date)) return;
        onChange(formatDate(date));
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    const displayValue = value ? formatDisplayDate(value, displayFormat) : "";

    return (
        <Popover
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!disabled) {
                    setOpenDropdown(null);
                    if (open) {
                        const d = parseDate(value);
                        if (d) {
                            setViewYear(d.getFullYear());
                            setViewMonth(d.getMonth());
                        } else {
                            setViewYear(today.getFullYear());
                            setViewMonth(today.getMonth());
                        }
                    }
                    setIsOpen(open);
                }
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
                    className={`
                        relative flex items-center w-full text-left
                        bg-white dark:bg-zinc-900
                        border border-overlay-strong dark:border-white/20
                        rounded-md transition-all outline-none
                        focus:border-primary focus:ring-0
                        disabled:cursor-not-allowed disabled:opacity-50
                        font-outfit font-normal text-base
                        ${isOpen ? "border-primary" : ""}
                        ${triggerClassName}
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
                    <span className={displayValue ? "text-gray-900 dark:text-white" : placeholderClassName ? placeholderClassName : `text-gray-400 dark:text-gray-500`}>
                        {displayValue || placeholder}
                    </span>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                        {value && showClearIcon && (
                            <span
                                className="pointer-events-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer p-0.5"
                                onClick={handleClear}
                                title="Clear"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </span>
                        )}
                        <CalendarIcon className="w-5 h-5 text-neutral-400" />
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-4 w-[300px] select-none border border-neutral-100 dark:border-zinc-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-colors"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1.5">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setOpenDropdown(d => d === "month" ? null : "month")}
                                    className="flex items-center gap-1 font-outfit font-semibold text-15 text-gray-900 dark:text-white rounded-md px-2 py-1 cursor-pointer outline-none hover:bg-neutral-100 dark:hover:bg-zinc-700 transition-colors"
                                    aria-label="Select month"
                                >
                                    {MONTHS[viewMonth]}
                                    <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                                {openDropdown === "month" && (
                                    <div className="absolute z-50 top-full left-0 mt-1 w-36 max-h-56 overflow-y-auto scrollbar-hide rounded-xl bg-white dark:bg-zinc-900 shadow-2xl border border-neutral-100 dark:border-zinc-700/50 py-1">
                                        {MONTHS.map((m, i) => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => { setViewMonth(i); setOpenDropdown(null); }}
                                                className={`w-full text-left px-3 py-1.5 font-outfit text-13 transition-colors ${i === viewMonth
                                                    ? "bg-accent text-white"
                                                    : "text-gray-700 dark:text-gray-200 hover:bg-neutral-100 dark:hover:bg-zinc-700"}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setOpenDropdown(d => d === "year" ? null : "year")}
                                    className="flex items-center gap-1 font-outfit font-semibold text-15 text-gray-900 dark:text-white rounded-md px-2 py-1 cursor-pointer outline-none hover:bg-neutral-100 dark:hover:bg-zinc-700 transition-colors"
                                    aria-label="Select year"
                                >
                                    {viewYear}
                                    <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                                {openDropdown === "year" && (
                                    <div className="absolute z-50 top-full right-0 mt-1 w-24 max-h-56 overflow-y-auto scrollbar-hide rounded-xl bg-white dark:bg-zinc-900 shadow-2xl border border-neutral-100 dark:border-zinc-700/50 py-1">
                                        {yearOptions.map((y) => (
                                            <button
                                                key={y}
                                                type="button"
                                                onClick={() => { setViewYear(y); setOpenDropdown(null); }}
                                                className={`w-full text-left px-3 py-1.5 font-outfit text-13 transition-colors ${y === viewYear
                                                    ? "bg-accent text-white"
                                                    : "text-gray-700 dark:text-gray-200 hover:bg-neutral-100 dark:hover:bg-zinc-700"}`}
                                            >
                                                {y}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-colors"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 mb-1">
                        {DAYS.map(day => (
                            <div key={day} className="flex items-center justify-center h-8 font-outfit font-medium text-11 text-neutral-400 dark:text-zinc-500 uppercase tracking-wide">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-0.5">
                        {calendarCells.map((date, idx) => {
                            if (!date) {
                                return <div key={`empty-${idx}`} />;
                            }
                            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                            const isToday = isSameDay(date, today);
                            const isDisabled = isDayDisabled(date);

                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => handleDayClick(date)}
                                    className={`
                                        flex items-center justify-center h-9 w-full rounded-full
                                        font-outfit text-13 font-medium transition-all
                                        ${isSelected
                                            ? "bg-accent text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30"
                                            : isToday
                                                ? "bg-blue-50 dark:bg-blue-900/20 text-accent font-semibold"
                                                : isDisabled
                                                    ? "text-neutral-300 dark:text-zinc-600 cursor-not-allowed"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-zinc-700 cursor-pointer"
                                        }
                                    `}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-zinc-700/50 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => {
                                const todayStr = formatDate(today);
                                if (!isDayDisabled(today)) {
                                    onChange(todayStr);
                                    setIsOpen(false);
                                }
                            }}
                            className="font-outfit text-xs font-medium text-accent hover:underline transition-all cursor-pointer"
                        >
                            Today
                        </button>
                        {value && (
                            <button
                                type="button"
                                onClick={() => { onChange(""); }}
                                className="font-outfit text-xs font-medium text-neutral-400 hover:text-red-400 dark:hover:text-red-400 transition-colors cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default CustomDatePicker;