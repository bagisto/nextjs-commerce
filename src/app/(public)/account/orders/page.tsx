import { getCustomerOrders } from "@/utils/bagisto";
import type { CustomerEdge, CustomerOrderListNode } from "@/types/customer/type";
import Link from "next/link";
import { Eye } from "lucide-react";
import clsx from "clsx";
import OrderFilters from "@/components/customer-detail/orders/OrderFilters";
import OrderPagination from "@/components/customer-detail/orders/OrderPagination";
import AccountBreadcrumbs from "@/components/layout/AccountBreadcrumbs";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";
import Image from "next/image";
import { IMAGES } from "@utils/constants";
import ScrollableContainer from "@/components/common/ScrollableContainer";

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const params = await searchParams;
    const limit = Number(params?.limit) || 10;
    const currentPage = Number(params?.page) || 1;
    const after = params?.cursor as string | undefined;

    const searchQuery = (params?.q as string || "").toLowerCase();
    const filterOrderId = (params?.orderId as string || "").toLowerCase();
    const filterTotal = params?.total as string || "";
    const filterStatus = (params?.status as string || "").toLowerCase();
    const startDate = params?.startDate as string || "";
    const endDate = params?.endDate as string || "";

    let currentAfterCursor = after;
    if (currentPage > 1 && !after) {
        const precedingData = await getCustomerOrders({
            first: (currentPage - 1) * limit,
        });
        currentAfterCursor = precedingData?.pageInfo?.endCursor;
    }

    const ordersData = await getCustomerOrders({
        first: limit,
        after: currentAfterCursor,
    });

    let orders = ordersData?.edges || [];
    let totalCount = ordersData?.totalCount || 0;
    const pageInfo = ordersData?.pageInfo;


    if (totalCount === 0) {
        return (
            <div className="w-full max-w-full overflow-hidden">
                <HideMainNavOnMobile />
                <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
                    <MobileNavHeader backUrl="/account" title="Downloadable Products" />
                </div>

                <div className="hidden lg:block">
                    <AccountBreadcrumbs />
                </div>

                <div className="flex items-center mt-5 lg:mt-2.5 mb-10 lg:mb-[30px">
                    <h1 className="font-outfit font-semibold text-2xl leading-[24px] lg:font-medium lg:text-26 lg:leading-[40px] text-black dark:text-white text-left">
                        Downloadable Products
                    </h1>
                </div>

                <div className="flex flex-col items-center justify-center w-full max-w-[1170px] min-h-[528px] gap-4">
                    <div className="relative w-[384px] h-[295px]">
                        <Image
                            src={IMAGES.noResult}
                            alt="No downloadable products"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="font-outfit font-normal text-xl leading-none text-center text-black dark:text-white">
                        No Orders Found.
                    </p>
                </div>
            </div>
        );
    }

    if (searchQuery || filterOrderId || filterTotal || filterStatus || startDate || endDate) {
        orders = orders.filter((edge: CustomerEdge<CustomerOrderListNode>) => {
            const order = edge.node;

            const qMatch = searchQuery ? (
                order.incrementId?.toLowerCase().includes(searchQuery) ||
                order.grandTotal?.toString().includes(searchQuery) ||
                order.status?.toLowerCase().includes(searchQuery)
            ) : true;

            const idMatch = filterOrderId ? order.incrementId?.toLowerCase().includes(filterOrderId) : true;

            const totalMatch = filterTotal ? order.grandTotal?.toString().includes(filterTotal) : true;

            const statusMatch = filterStatus ? order.status?.toLowerCase().includes(filterStatus) : true;

            let dateMatch = true;
            if (startDate || endDate) {
                const orderDate = new Date(order.createdAt).getTime();
                if (startDate) {
                    const start = new Date(startDate).setHours(0, 0, 0, 0);
                    if (orderDate < start) dateMatch = false;
                }
                if (endDate) {
                    const end = new Date(endDate).setHours(23, 59, 59, 999);
                    if (orderDate > end) dateMatch = false;
                }
            }

            return qMatch && idMatch && totalMatch && statusMatch && dateMatch;
        });

        totalCount = orders.length;
    }

    const totalPages = Math.ceil(totalCount / limit);

    const getStatusStyles = (status: string) => {
        const s = (status || "").toLowerCase();
        switch (s) {
            case "processing":
                return "bg-info text-white";
            case "pending":
                return "bg-rating text-white";
            case "completed":
                return "bg-success text-white";
            case "canceled":
            case "cancelled":
                return "bg-danger text-white";
            case "closed":
                return "bg-neutral-500 text-white";
            default:
                return "bg-neutral-400 text-white";
        }
    };

    const formatOrderDate = (dateStr: string) => {
        if (!dateStr) return { date: "N/A", time: "" };
        const date = new Date(dateStr);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');

        return {
            date: `${y}-${m}-${d}`,
            time: `${h}:${min}:${sec}`
        };
    };

    return (
        <div className="w-full max-w-full">
            <HideMainNavOnMobile />
            <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
                <MobileNavHeader backUrl="/account" />
            </div>

            <div className="hidden lg:block">
                <AccountBreadcrumbs />
            </div>

            <div className="flex items-center mt-5 lg:mt-2.5 mb-6 lg:mb-7_5 pb-2.5 lg:border-none lg:pb-0">
                <h1 className="font-outfit font-semibold text-2xl leading-[24px] lg:font-medium lg:text-26 lg:leading-[40px] text-black dark:text-white text-left">
                    Orders
                </h1>
            </div>

            <OrderFilters initialLimit={limit} />

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full max-w-[1170px] min-h-[528px] gap-4">
                    <div className="relative w-[384px] h-[295px]">
                        <Image
                            src={IMAGES.noResult}
                            alt="No downloadable products"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="font-outfit font-normal text-xl leading-none text-center text-black dark:text-white">
                        No Orders Found.
                    </p>
                </div>
            ) : (
                <div className="w-full xl:max-w-[1030px] bg-white dark:bg-neutral-900 lg:border lg:border-border-muted dark:lg:border-neutral-800 lg:rounded-md overflow-hidden">
                    <ScrollableContainer className="overflow-x-auto w-full hidden lg:block">
                        <table className="w-full border-collapse min-w-[650px]">
                            <thead>
                                <tr className="h-[70px] bg-overlay-subtle dark:bg-neutral-800 border-b border-border-muted dark:border-neutral-700">
                                    <th className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white whitespace-nowrap">Order Id</th>
                                    <th className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white whitespace-nowrap">Order Date</th>
                                    <th className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white whitespace-nowrap">Total</th>
                                    <th className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white whitespace-nowrap">Status</th>
                                    <th className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                                {orders.length > 0 ? (
                                    orders.map((edge: CustomerEdge<CustomerOrderListNode>) => {
                                        const order = edge.node;
                                        const { date, time } = formatOrderDate(order.createdAt);

                                        return (
                                            <tr key={order._id} className="h-18 border-b border-border-muted dark:border-neutral-700 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer">
                                                <td className="px-6 font-outfit font-medium text-base leading-[22px] text-black dark:text-white">
                                                    {order.incrementId}
                                                </td>
                                                <td className="px-6 font-outfit font-medium text-base leading-[22px] text-black dark:text-white">
                                                    <div>{date} {time}</div>
                                                </td>
                                                <td className="px-6 font-outfit font-medium text-base leading-[22px] text-black dark:text-white">
                                                    {order.orderCurrencyCode} {parseFloat(order.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 text-left">
                                                    <span className={clsx(
                                                        "h-6 min-w-[78px] rounded-xl px-2.5 inline-flex items-center justify-center font-outfit font-medium text-sm leading-[20px] whitespace-nowrap",
                                                        getStatusStyles(order.status)
                                                    )}>
                                                        {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : "Pending"}
                                                    </span>
                                                </td>
                                                <td className="px-6 text-left">
                                                    <Link
                                                        href={`/account/orders/view/${order._id}`}
                                                        className="inline-flex items-center justify-start text-black dark:text-white hover:text-accent transition-all cursor-pointer"
                                                    >
                                                        <Eye size={24} strokeWidth={1.5} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center font-outfit text-neutral-400">
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </ScrollableContainer>

                    <div className="px-8 py-6 flex-col sm:flex-row justify-between items-center gap-6 hidden lg:flex">
                        <p className="font-outfit font-normal text-sm leading-[20px] text-black dark:text-white">
                            Showing {(currentPage - 1) * limit + 1} to {Math.min((currentPage - 1) * limit + orders.length, totalCount)} of {totalCount} entries
                        </p>
                        <OrderPagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            nextCursor={pageInfo?.endCursor}
                        />
                    </div>

                    <div className="block lg:hidden w-full pb-20 pt-4">
                        {orders.length > 0 ? (
                            orders.map((edge: CustomerEdge<CustomerOrderListNode>) => {
                                const order = edge.node;
                                const { date, time } = formatOrderDate(order.createdAt);

                                return (
                                    <Link
                                        href={`/account/orders/view/${order._id}`}
                                        key={order._id}
                                        className="block mb-4 rounded-md border border-border-muted dark:border-dark-grey bg-white dark:bg-transparent p-3 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-3">
                                                <div className="font-outfit font-medium text-sm leading-[22px] text-black/80 dark:text-white/80">
                                                    Order Id: <span className="text-black dark:text-white">{order.incrementId}</span>
                                                </div>
                                                <div className="font-outfit font-normal text-xs leading-[22px] text-black/60 dark:text-selected-white">
                                                    {date} {time}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-outfit font-medium text-xs leading-[22px] text-black/80 dark:text-white/80">Subtotal</span>
                                                    <span className="font-outfit font-medium text-base leading-[22px] text-black dark:text-white">
                                                        {order.orderCurrencyCode} {parseFloat(order.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>

                                            <span className={clsx(
                                                "h-5 w-[78px] rounded-xl flex items-center justify-center font-outfit font-medium text-xs leading-[20px] shrink-0",
                                                getStatusStyles(order.status)
                                            )}>
                                                {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : "Pending"}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="py-10 text-center font-outfit text-neutral-400">
                                No orders found.
                            </div>
                        )}

                        {orders.length > 0 && (
                            <div className="flex flex-row justify-between items-center h-10">
                                <p className="font-outfit font-regular text-xs leading-[20px] text-black dark:text-white">
                                    Showing {(currentPage - 1) * limit + 1} to {Math.min((currentPage - 1) * limit + orders.length, totalCount)} of {totalCount} entries
                                </p>
                                <OrderPagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    nextCursor={pageInfo?.endCursor}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
