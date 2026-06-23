"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ orderId: _orderId }: { orderId: string }) {
    const handlePrint = () => {
        const date = new Date().toISOString().split('T')[0];

        const originalTitle = document.title;
        document.title = `invoice-${date}`;

        window.print();

        window.addEventListener('afterprint', () => {
            document.title = originalTitle;
        }, { once: true });
    };

    return (
        <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl font-outfit font-bold text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all shadow-sm"
        >
            <Printer size={20} />
            <span>Print</span>
        </button>
    );
}
