"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    Button,
    Input,
    Select,
    SelectItem
} from "@heroui/react";
import Image from "next/image";
import clsx from "clsx";
import { CustomDatePicker } from "@components/ui/CustomDatePicker";
import { IMAGES, ORDER_STATUS_OPTIONS, PER_PAGE_LIMIT_OPTIONS } from "@/utils/constants";
import { DATE_QUICK_FILTERS, getQuickDateRange, getQuickDateLabel } from "@/utils/dateFilters";

export default function OrderFilters({
    initialLimit
}: {
    initialLimit: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

    const [filterOrderId, setFilterOrderId] = useState(searchParams.get("orderId") || "");
    const [filterTotal, setFilterTotal] = useState(searchParams.get("total") || "");
    const [filterStatus, setFilterStatus] = useState(searchParams.get("status") || "");
    const [filterDateRange, setFilterDateRange] = useState({
        start: searchParams.get("startDate") || "",
        end: searchParams.get("endDate") || "",
    });
    const [selectedQuickDateLabel, setSelectedQuickDateLabel] = useState(() =>
        getQuickDateLabel(searchParams.get("startDate") || "", searchParams.get("endDate") || "")
    );


    const handleOpenDrawer = () => {
        const start = searchParams.get("startDate") || "";
        const end = searchParams.get("endDate") || "";
        setFilterOrderId(searchParams.get("orderId") || "");
        setFilterTotal(searchParams.get("total") || "");
        setFilterStatus(searchParams.get("status") || "");
        setFilterDateRange({ start, end });
        setSelectedQuickDateLabel(getQuickDateLabel(start, end));
        onOpen();
    };


    const isModified = useMemo(() => {
        return filterOrderId !== (searchParams.get("orderId") || "") ||
            filterTotal !== (searchParams.get("total") || "") ||
            filterStatus !== (searchParams.get("status") || "") ||
            filterDateRange.start !== (searchParams.get("startDate") || "") ||
            filterDateRange.end !== (searchParams.get("endDate") || "");
    }, [filterOrderId, filterTotal, filterStatus, filterDateRange, searchParams]);

    const hasAnyFilter = useMemo(() => {
        return !!(filterOrderId || filterTotal || filterStatus || filterDateRange.start || filterDateRange.end);
    }, [filterOrderId, filterTotal, filterStatus, filterDateRange]);


    const isAnyFilterActive = useMemo(() => {
        return searchParams.has("orderId") ||
            searchParams.has("total") ||
            searchParams.has("status") ||
            searchParams.has("startDate") ||
            searchParams.has("endDate");
    }, [searchParams]);


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchValue) {
                params.set("q", searchValue);
            } else {
                params.delete("q");
            }
            params.delete("cursor");
            params.delete("page");

            if (searchParams.get("q") !== (searchValue || null)) {
                router.push(`${pathname}?${params.toString()}`);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchValue, pathname, router, searchParams]);

    const handleLimitChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", value);
        params.delete("cursor");
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    };

    const applyFilters = () => {
        if (!isModified) {
            onClose();
            return;
        }

        const params = new URLSearchParams(searchParams.toString());

        if (filterOrderId) params.set("orderId", filterOrderId);
        else params.delete("orderId");

        if (filterTotal) params.set("total", filterTotal);
        else params.delete("total");

        if (filterStatus) params.set("status", filterStatus);
        else params.delete("status");

        if (filterDateRange.start) params.set("startDate", filterDateRange.start);
        else params.delete("startDate");

        if (filterDateRange.end) params.set("endDate", filterDateRange.end);
        else params.delete("endDate");

        params.delete("cursor");
        params.delete("page");

        router.push(`${pathname}?${params.toString()}`);
        onClose();
    };

    const handleClearSection = (section: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (section === "orderId") {
            setFilterOrderId("");
            params.delete("orderId");
        } else if (section === "total") {
            setFilterTotal("");
            params.delete("total");
        } else if (section === "date") {
            setFilterDateRange({ start: "", end: "" });
            setSelectedQuickDateLabel("");
            params.delete("startDate");
            params.delete("endDate");
        } else if (section === "status") {
            setFilterStatus("");
            params.delete("status");
        }

        params.delete("cursor");
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleQuickDateFilter = (type: string) => {
        setFilterDateRange(getQuickDateRange(type));
        const found = DATE_QUICK_FILTERS.find(f => f.value === type);
        setSelectedQuickDateLabel(found ? found.label : "");
    };

    return (
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-4 w-full xl:max-w-[1030px]">

            <div className="hidden lg:flex items-center w-full lg:max-w-xl">
                <div className="w-full md:max-w-[248px]">
                    <input
                        type="text"
                        placeholder="Search Here..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full h-9 px-4 bg-overlay-subtle dark:bg-neutral-800 border border-transparent rounded-md font-outfit font-medium text-xs leading-[20px] text-black dark:text-white focus:ring-1 focus:ring-accent transition-all placeholder:text-muted text-left"
                    />
                </div>
            </div>

            <div className="hidden lg:flex flex-wrap md:flex-nowrap items-center gap-2.5 md:gap-5 w-full lg:w-auto justify-end md:max-w-[424px]">
                <span className="font-outfit font-medium text-xs leading-[22px] text-ink dark:text-selected-white whitespace-nowrap">
                    Items per page
                </span>
                <div className="flex items-center">
                    <div className="relative w-20 md:w-[154px] h-9">
                        <Select
                            placeholder="10"
                            selectedKeys={[String(initialLimit)]}
                                onChange={(e) => handleLimitChange(e.target.value)}
                            classNames={{
                                trigger: "h-9 min-h-9 rounded-md border border-transparent bg-overlay-subtle dark:bg-neutral-800 shadow-none px-5 transition-all cursor-pointer",
                                value: "font-outfit font-medium text-xs leading-[20px] text-muted dark:text-selected-white",
                                base: "w-full",
                                selectorIcon: "hidden"
                            }}
                        >
                            {PER_PAGE_LIMIT_OPTIONS.map((opt) => (
                                <SelectItem key={String(opt)}>{String(opt)}</SelectItem>
                            ))}
                        </Select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <Image
                                src={IMAGES.sortBy}
                                alt=""
                                width={24}
                                height={24}
                                className="invert dark:invert-0"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleOpenDrawer}
                        className={clsx(
                            "w-[100px] md:w-[154px] h-9 px-4 bg-overlay-subtle dark:bg-neutral-800 border border-transparent rounded-md font-outfit font-medium text-xs leading-[20px] flex items-center justify-start transition-all cursor-pointer",
                            isAnyFilterActive ? "text-accent" : "text-muted"
                        )}
                    >
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            <div className="block lg:hidden w-full">
                <div className="flex items-center gap-4 w-full">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search Here..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="w-full h-10 px-4 py-2 bg-neutral-100 dark:bg-surface-dark rounded-md font-outfit font-medium text-xs leading-[20px] text-black dark:text-white focus:ring-1 focus:ring-accent transition-all placeholder:text-muted text-left outline-none"
                        />
                    </div>
                    <button
                        onClick={handleOpenDrawer}
                        className={clsx(
                            "w-10 h-10 flex items-center justify-center rounded-md shrink-0 transition-all cursor-pointer",
                            isAnyFilterActive
                                ? "bg-accent dark:bg-accent"
                                : "bg-neutral-100 dark:bg-surface-dark"
                        )}
                    >
                        <Image
                            src={IMAGES.filter}
                            alt="Filter"
                            width={24}
                            height={24}
                            className="pointer-events-none dark:invert-0 invert"
                        />
                    </button>
                </div>

                <div className="flex items-center mt-4 w-full">
                    <div className="flex items-center gap-4">
                        <span className="font-outfit font-medium text-xs leading-[22px] text-black dark:text-white whitespace-nowrap">
                            Items per page
                        </span>
                        <div className="relative w-[85px] h-10">
                            <Select
                                placeholder="10"
                                selectedKeys={[String(initialLimit)]}
                                onChange={(e) => handleLimitChange(e.target.value)}
                                classNames={{
                                    trigger: "h-9 min-h-9 rounded-md border border-transparent bg-overlay-subtle dark:bg-neutral-800 shadow-none px-5 transition-all cursor-pointer ",
                                    value: "font-outfit font-medium text-xs leading-[20px] text-muted dark:text-selected-white",
                                    base: "w-full",
                                    selectorIcon: "hidden"
                                }}
                            >
                                {PER_PAGE_LIMIT_OPTIONS.map((opt) => (
                                    <SelectItem key={String(opt)}>{String(opt)}</SelectItem>
                                ))}
                            </Select>
                            <div className="pointer-events-none absolute inset-y-0 right-[10px] flex items-center">
                                <Image
                                    src={IMAGES.sortBy}
                                    alt=""
                                    width={12}
                                    height={12}
                                    className="invert dark:invert-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={isOpen}
                onClose={onClose}
                placement="right"
                size="sm"
                radius="none"
                hideCloseButton
                classNames={{
                    base: "max-w-[400px]"
                }}
            >
                <DrawerContent>
                    <DrawerHeader className="flex flex-row justify-between items-center px-8 py-6 lg:border-b lg:border-neutral-100 dark:lg:border-neutral-800">
                        <span className="font-outfit text-22 font-semibold text-black dark:text-white">Apply Filters</span>
                        <Button isIconOnly variant="light" onClick={onClose} className="text-black dark:text-white min-w-unit-10 cursor-pointer">
                            <X size={24} />
                        </Button>
                    </DrawerHeader>
                    <DrawerBody className="px-8 py-8 flex flex-col h-full scrollbar-hide overflow-y-auto">
                        <div className="flex flex-col gap-8 pb-32">
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-outfit text-sm font-medium text-black dark:text-white">Order ID</span>
                                    {filterOrderId && (
                                        <button
                                            onClick={() => handleClearSection("orderId")}
                                            className="text-accent text-13 font-medium hover:underline cursor-pointer"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <Input
                                    placeholder="Order ID"
                                    value={filterOrderId}
                                    onChange={(e) => setFilterOrderId(e.target.value)}
                                    classNames={{
                                        inputWrapper: "h-[43px] border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 border"
                                    }}
                                />
                                {filterOrderId && (
                                    <div className="flex">
                                        <div className="bg-surface-slate text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm">
                                            {filterOrderId}
                                            <X size={14} className="cursor-pointer" onClick={() => handleClearSection("orderId")} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-outfit text-sm font-medium text-black dark:text-white">Order Date</span>
                                    {(filterDateRange.start || filterDateRange.end) && (
                                        <button
                                            onClick={() => handleClearSection("date")}
                                            className="text-accent text-13 font-medium hover:underline cursor-pointer"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {DATE_QUICK_FILTERS.map((f) => (
                                        <button
                                            key={f.value}
                                            onClick={() => handleQuickDateFilter(f.value)}
                                            className="py-2.5 px-4 border border-neutral-200 dark:border-neutral-700 rounded-xl font-outfit text-sm text-neutral-600 dark:text-selected-white hover:border-accent hover:text-accent transition-all cursor-pointer"
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <CustomDatePicker
                                        value={filterDateRange.start}
                                        onChange={(val) => {
                                            setFilterDateRange(prev => ({ ...prev, start: val }));
                                            setSelectedQuickDateLabel("");
                                        }}
                                        placeholder="From"
                                        style={{
                                            height: '43px',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            padding: '10px 16px',
                                        }}
                                        className="border-neutral-200 dark:border-neutral-700 rounded-xl text-sm"
                                        placeholderClassName="text-neutral-600 dark:text-selected-white"
                                    />
                                    <CustomDatePicker
                                        value={filterDateRange.end}
                                        onChange={(val) => {
                                            setFilterDateRange(prev => ({ ...prev, end: val }));
                                            setSelectedQuickDateLabel("");
                                        }}
                                        placeholder="To"
                                        minDate={filterDateRange.start || undefined}
                                        style={{
                                            height: '43px',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            padding: '10px 16px',
                                        }}
                                        className="border-neutral-200 dark:border-neutral-700 rounded-xl text-sm"
                                        placeholderClassName="text-neutral-600 dark:text-selected-white"
                                    />
                                </div>
                                {(filterDateRange.start || filterDateRange.end) && (
                                    <div className="flex">
                                        <div className="bg-surface-slate text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm">
                                            <span>
                                                {selectedQuickDateLabel || `${filterDateRange.start || "..."} to ${filterDateRange.end || "..."}`}
                                            </span>
                                            <X size={14} className="cursor-pointer" onClick={() => handleClearSection("date")} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-outfit text-sm font-medium text-black dark:text-white">Total</span>
                                    {filterTotal && (
                                        <button
                                            onClick={() => handleClearSection("total")}
                                            className="text-accent text-13 font-medium hover:underline cursor-pointer"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <Input
                                    placeholder="Total"
                                    value={filterTotal}
                                    onChange={(e) => setFilterTotal(e.target.value)}
                                    classNames={{
                                        inputWrapper: "h-[43px] border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 border"
                                    }}
                                />
                                {filterTotal && (
                                    <div className="flex">
                                        <div className="bg-surface-slate text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm">
                                            {filterTotal}
                                            <X size={14} className="cursor-pointer" onClick={() => handleClearSection("total")} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-outfit text-sm font-medium text-black dark:text-white">Status</span>
                                    {filterStatus && (
                                        <button
                                            onClick={() => handleClearSection("status")}
                                            className="text-accent text-13 font-medium hover:underline cursor-pointer"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <Select
                                    placeholder="Select"
                                    selectedKeys={filterStatus ? [filterStatus] : []}
                                    onSelectionChange={(keys) => setFilterStatus(Array.from(keys)[0] as string)}
                                    classNames={{
                                        trigger: "h-[43px] border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 border shadow-none cursor-pointer"
                                    }}
                                >
                                    {ORDER_STATUS_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} textValue={opt.label}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {filterStatus && (
                                    <div className="flex">
                                        <div className="bg-surface-slate text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm capitalize">
                                            {filterStatus}
                                            <X size={14} className="cursor-pointer" onClick={() => handleClearSection("status")} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 z-10">
                            <button
                                onClick={applyFilters}
                                className={clsx(
                                    "w-full py-3 md:py-4 rounded-xl font-outfit text-base md:text-lg font-semibold transition-all shadow-md cursor-pointer",
                                    isModified || hasAnyFilter
                                        ? "bg-accent hover:bg-primary-strong text-white"
                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed shadow-none"
                                )}
                                disabled={!isModified && !hasAnyFilter}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
