import { getCompareItemsAction } from "@/utils/actions";
import CompareTable from "@/components/customer-detail/compare/CompareTable";
import Link from "next/link";
import Image from "next/image";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { IMAGES } from "@/utils/constants";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";
import MobileCompareHeader from "./MobileCompareHeader";

export default async function ComparePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const limit = Number(params?.limit) || 10;
    const currentPage = Number(params?.page) || 1;
    const after = params?.cursor as string | undefined;

    let currentAfterCursor = after;
    if (currentPage > 1 && !after) {
        const precedingData = await getCompareItemsAction({
            first: (currentPage - 1) * limit,
        });
        currentAfterCursor = precedingData?.pageInfo?.endCursor;
    }

    const data = await getCompareItemsAction({
        first: limit,
        after: currentAfterCursor,
    });

    const compareItems = data?.edges || [];
    const totalCount = data?.totalCount || 0;
    const pageInfo = data?.pageInfo;
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 min-h-[70vh]">
            <HideMainNavOnMobile />
            <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-8 bg-white dark:bg-black">
                <MobileNavHeader backUrl="/" />
            </div>

            <div className="hidden lg:flex items-center gap-2 mb-8 text-base leading-[26px] font-medium font-outfit mt-4">
                <Link href="/" className="text-black dark:text-white hover:underline">
                    Home
                </Link>
                <span className="text-neutral-400">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
                <span className="text-muted">Product Compare</span>
            </div>

            {totalCount > 0 ? (
                <MobileCompareHeader />
            ) : (
                <div className="flex lg:hidden flex-col gap-6 mb-6 mt-4">
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white font-outfit">
                        Product Compare
                    </h1>
                </div>
            )}


            {totalCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900">
                    <div className="relative w-[320px] h-[320px] mb-8">
                        <Image
                            src={IMAGES.emptyCompare}
                            alt="No products to compare"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="text-black dark:text-white font-outfit text-2xl font-normal text-center leading-none">
                        You haven&apos;t added any products to compare yet.
                    </p>
                </div>
            ) : (
                <CompareTable
                    items={compareItems}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    nextCursor={pageInfo?.endCursor}
                    limit={limit}
                    totalCount={totalCount}
                />
            )}
        </div>
    );
}
