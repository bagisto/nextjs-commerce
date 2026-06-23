export const DATE_QUICK_FILTERS = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
    { label: "Last 3 Months", value: "last_3_months" },
    { label: "Last 6 Months", value: "last_6_months" },
    { label: "This Year", value: "this_year" },
];

const formatDate = (d: Date) => d.toISOString().split("T")[0];

export const getQuickDateRange = (type: string): { start: string; end: string } => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (type) {
        case "today":
            start.setHours(0, 0, 0, 0);
            break;
        case "yesterday":
            start.setDate(now.getDate() - 1);
            start.setHours(0, 0, 0, 0);
            end.setDate(now.getDate() - 1);
            end.setHours(23, 59, 59, 999);
            break;
        case "this_week": {
            const day = now.getDay();
            start.setDate(now.getDate() - day);
            start.setHours(0, 0, 0, 0);
            break;
        }
        case "this_month":
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case "last_month":
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
        case "last_3_months":
            start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            break;
        case "last_6_months":
            start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
            break;
        case "this_year":
            start = new Date(now.getFullYear(), 0, 1);
            break;
    }

    return { start: formatDate(start), end: formatDate(end) };
};

export const getQuickDateLabel = (start: string, end: string): string => {
    if (!start) return "";

    for (const filter of DATE_QUICK_FILTERS) {
        const range = getQuickDateRange(filter.value);
        if (range.start === start && range.end === end) {
            return filter.label;
        }
    }
    return "";
};
