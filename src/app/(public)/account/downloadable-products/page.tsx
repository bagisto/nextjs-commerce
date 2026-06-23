import { getCustomerDownloadableProducts } from "@/utils/bagisto";
import { STOREFRONT_KEY, IMAGES } from "@/utils/constants";
import clsx from "clsx";
import Image from "next/image";
import DownloadableProductFilters from "@/components/customer-detail/downloadable-product/DownloadableProductFilters";
import DownloadableProductPagination from "@/components/customer-detail/downloadable-product/DownloadableProductPagination";
import DownloadButton from "@/components/customer-detail/downloadable-product/DownloadButton";
import AccountBreadcrumbs from "@/components/layout/AccountBreadcrumbs";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";
import ScrollableContainer from "@/components/common/ScrollableContainer";

export default async function DownloadableProductsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const params = await searchParams;
    const limit = Number(params?.limit) || 10;
    const currentPage = Number(params?.page) || 1;
    const after = params?.cursor as string | undefined;
    const searchQuery = (params?.q as string || "").toLowerCase();

    const filterOrderId = params?.orderId as string | undefined;
    const filterStatus = params?.status as string | undefined;
    const filterStartDate = params?.startDate as string | undefined;
    const filterEndDate = params?.endDate as string | undefined;

    let currentAfterCursor = after;
    if (currentPage > 1 && !after) {
        const precedingData = await getCustomerDownloadableProducts({
            first: (currentPage - 1) * limit,
        });
        currentAfterCursor = precedingData?.pageInfo?.endCursor;
    }

    const data = await getCustomerDownloadableProducts({
        first: limit,
        after: currentAfterCursor,
    });

    let products = data?.edges || [];
    let totalCount = data?.totalCount || 0;
    const pageInfo = data?.pageInfo;

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
                            src={IMAGES.noDownloadableProducts}
                            alt="No downloadable products"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="font-outfit font-normal text-xl leading-none text-center text-black dark:text-white">
                        You don&rsquo;t have a product to download
                    </p>
                </div>
            </div>
        );
    }

    if (searchQuery || filterOrderId || filterStatus || filterStartDate || filterEndDate) {
        products = products.filter((edge: any) => {
            const item = edge.node;

            const matchesSearch = !searchQuery || (
                item.productName?.toLowerCase().includes(searchQuery) ||
                item.order?.incrementId?.toLowerCase().includes(searchQuery) ||
                item.status?.toLowerCase().includes(searchQuery)
            );

            const matchesOrderId = !filterOrderId || item.order?.incrementId?.toLowerCase().includes(filterOrderId.toLowerCase());

            const matchesStatus = !filterStatus || item.status?.toLowerCase() === filterStatus.toLowerCase();

            let matchesDate = true;
            if (item.createdAt) {
                const createdAt = new Date(item.createdAt).getTime();
                if (filterStartDate) {
                    const start = new Date(filterStartDate).getTime();
                    if (createdAt < start) matchesDate = false;
                }
                if (filterEndDate) {
                    const end = new Date(filterEndDate);
                    end.setHours(23, 59, 59, 999);
                    if (createdAt > end.getTime()) matchesDate = false;
                }
            }

            return matchesSearch && matchesOrderId && matchesStatus && matchesDate;
        });
        totalCount = products.length;
    }

    const totalPages = Math.ceil(totalCount / limit);

    const getStatusStyles = (status: string) => {
        const s = (status || "").toLowerCase();
        switch (s) {
            case "available":
                return "text-black dark:text-white";
            case "expired":
                return "text-black dark:text-white";
            default:
                return "text-black dark:text-white";
        }
    };

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');

        return `${y}-${m}-${d} ${h}:${min}:${sec}`;
    };

    return (
        <div className="w-full max-w-full">
            <HideMainNavOnMobile />
            <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
                <MobileNavHeader backUrl="/account"  />
            </div>

            <div className="hidden lg:block">
                <AccountBreadcrumbs />
            </div>

            <div className="flex items-center mt-5 lg:mt-6 mb-6 lg:mb-7_5 pb-2.5  lg:border-none lg:pb-0">
                <div className="flex items-center gap-2.5 w-full lg:w-auto">
                    <h1 className="font-outfit font-semibold text-2xl leading-[24px] lg:font-medium lg:text-26 lg:leading-[40px] text-black dark:text-white text-left">
                        Downloadable Products
                    </h1>
                </div>
            </div>

            <DownloadableProductFilters initialLimit={limit} />

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full max-w-[1170px] min-h-[528px] gap-4">
                    <div className="relative w-[384px] h-[295px]">
                        <Image
                            src={IMAGES.noDownloadableProducts}
                            alt="No downloadable products"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="font-outfit font-normal text-xl leading-none text-center text-black dark:text-white">
                        You don&rsquo;t have a product to download
                    </p>
                </div>
            ) : (
                <div className="w-full xl:max-w-[1030px] bg-white dark:bg-neutral-900 lg:border lg:border-border-muted dark:lg:border-neutral-800 lg:rounded-md overflow-hidden">
                    <ScrollableContainer className="overflow-x-auto w-full hidden lg:block">
                        <table className="w-full border-collapse min-w-[750px]">
                            <thead>
                                <tr className="h-[70px] bg-overlay-subtle dark:bg-neutral-800 border-b border-border-muted dark:border-neutral-700">
                                    <th className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white whitespace-nowrap">Order Id</th>
                                    <th className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white whitespace-nowrap">Title</th>
                                    <th className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white whitespace-nowrap">Order Date</th>
                                    <th className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white whitespace-nowrap">Status</th>
                                    <th className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white whitespace-nowrap">Remaining Downloads</th>
                                    <th className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                                {products.map((edge: any) => {
                                    const item = edge.node;
                                    return (
                                        <tr key={item._id} className="h-18 border-b border-border-muted dark:border-neutral-700 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-6 font-outfit font-medium text-base leading-[22px] text-black dark:text-white">
                                                {item.order?.incrementId || "N/A"}
                                            </td>
                                            <td className="px-6 font-outfit font-medium text-base leading-[22px] text-black dark:text-white">
                                                {item.productName}
                                            </td>
                                            <td className="px-6 font-outfit font-medium text-base leading-[22px] text-black dark:text-white">
                                                {formatDateTime(item.createdAt)}
                                            </td>
                                            <td className="px-6 text-left">
                                                <span className={clsx(
                                                    "h-5  rounded-xl inline-flex items-center justify-center font-outfit font-medium text-base leading-[20px] whitespace-nowrap",
                                                    getStatusStyles(item.status)
                                                )}>
                                                    {item.status ? (item.status.charAt(0).toUpperCase() + item.status.slice(1)) : "Pending"}
                                                </span>
                                            </td>
                                            <td className="px-6 text-left font-outfit font-medium text-base leading-[22px] text-black dark:text-white">
                                                {item.remainingDownloads}
                                            </td>
                                            <td className="px-6 text-left">
                                                <DownloadButton
                                                    url={item.downloadUrl}
                                                    fileName={item.fileName || item.productName}
                                                    storefrontKey={STOREFRONT_KEY}
                                                >
                                                    <div className="w-[84px] h-[22px] opacity-80 items-center justify-center rounded-xs mx-0">
                                                        <span className="font-outfit font-medium text-base leading-[22px] text-primary dark:text-primary-soft">
                                                            Download
                                                        </span>
                                                    </div>
                                                </DownloadButton>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </ScrollableContainer>

                    <div className="px-8 py-6 flex-col sm:flex-row justify-between items-center gap-6 hidden lg:flex">
                        <p className="font-outfit font-normal text-sm leading-[20px] text-black dark:text-white">
                            Showing {(currentPage - 1) * limit + 1} to {Math.min((currentPage - 1) * limit + products.length, totalCount)} of {totalCount} entries
                        </p>
                        <DownloadableProductPagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            nextCursor={pageInfo?.endCursor}
                        />
                    </div>

                    <div className="block lg:hidden w-full pb-20 pt-6">
                        {products.map((edge: any) => {
                            const item = edge.node;
                            const dateStr = formatDateTime(item.createdAt);

                            return (
                                <div
                                    key={item._id}
                                    className="mb-4 rounded-md border border-border-muted dark:border-dark-grey bg-white dark:bg-transparent p-3"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-3">
                                            <div className="font-outfit font-medium text-sm leading-[22px] text-black/80 dark:text-white/80">
                                                Order Id: <span className="text-black dark:text-white">{item.order?.incrementId || "N/A"}</span>
                                            </div>
                                            <div className="font-outfit font-normal text-xs leading-[22px] text-black/60 dark:text-selected-white">
                                                {dateStr}
                                            </div>
                                            <div className="font-outfit font-medium text-sm leading-[22px] text-black/80 dark:text-white/80">
                                                Status: <span className="text-black dark:text-white capitalize">{item.status ? item.status : "Pending"}</span>
                                            </div>
                                            <div className="font-outfit font-normal text-xs leading-[22px] text-black/60 dark:text-selected-white">
                                                Remaining Downloads
                                                <br />
                                                <span className="font-outfit font-medium text-sm leading-[22px] text-black dark:text-white">
                                                    {item.remainingDownloads}
                                                </span>
                                            </div>
                                        </div>

                                        <DownloadButton
                                            url={item.downloadUrl}
                                            fileName={item.fileName || item.productName}
                                            storefrontKey={STOREFRONT_KEY}
                                        >
                                            <div className="h-5 flex items-center justify-center rounded-xs">
                                                <span className="font-outfit font-medium text-xs leading-[20px] text-primary dark:text-primary-soft">
                                                    Download
                                                </span>
                                            </div>
                                        </DownloadButton>
                                    </div>
                                </div>
                            );
                        })}

                        {products.length > 0 && (
                            <div className="flex flex-row justify-between items-center w-full h-10">
                                <p className="font-outfit font-normal text-xs leading-[20px] text-black dark:text-white">
                                    Showing {(currentPage - 1) * limit + 1} to {Math.min((currentPage - 1) * limit + products.length, totalCount)} of {totalCount} entries
                                </p>
                                <DownloadableProductPagination
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