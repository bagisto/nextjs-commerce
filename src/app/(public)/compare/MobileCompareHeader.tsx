"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteAllCompareAction } from "@/utils/actions";
import { clearCache as clearCompareCache } from "@/utils/compare-cache";
import { useCustomToast } from "@/utils/hooks/useToast";
import { useRouter } from "next/navigation";

/**
 * Mobile-only header row: "Product Compare" title + "Delete All" button
 * side-by-side on the same line (Figma spec for 417px screen).
 */
export default function MobileCompareHeader() {
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const { showToast } = useCustomToast();
    const router = useRouter();

    const handleDeleteAll = async () => {
        setIsDeletingAll(true);
        const result = await deleteAllCompareAction();
        if (result.success) {
            clearCompareCache();
            showToast(result.message || "All products removed from comparison list", "success");
            router.refresh();
        } else {
            showToast(result.message || "Failed to remove products", "danger");
        }
        setIsDeletingAll(false);
    };

    return (
        <div className="flex lg:hidden items-center justify-between mb-6 mt-4">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white font-outfit leading-none">
                Product Compare
            </h1>

            <button
                onClick={handleDeleteAll}
                disabled={isDeletingAll}
                className="flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-outfit font-medium text-13 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50 flex-shrink-0"
            >
                {isDeletingAll
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Trash2 size={16} className="text-neutral-900 dark:text-white" />}
                Delete All
            </button>
        </div>
    );
}
