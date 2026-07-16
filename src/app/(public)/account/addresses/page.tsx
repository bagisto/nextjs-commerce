import { getCustomerAddresses } from "@/utils/bagisto";
import type { CustomerEdge, CustomerAddress } from "@/types/customer/type";
import { Plus } from "lucide-react";
import Link from "next/link";
import ReviewPagination from "@/components/customer-detail/review/ReviewPagination";
import AddressCard from "@/components/customer-detail/addresses/AddressCard";
import Image from "next/image";
import AccountBreadcrumbs from "@/components/layout/AccountBreadcrumbs";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { IMAGES } from "@/utils/constants";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

export default async function AddressesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const params = await searchParams;
    const limit = Number(params?.limit) || 10;
    const currentPage = Number(params?.page) || 1;
    const after = params?.cursor as string | undefined;

    let currentAfterCursor = after;
    if (currentPage > 1 && !after) {
        const precedingData = await getCustomerAddresses({
            first: (currentPage - 1) * limit,
        });
        currentAfterCursor = precedingData?.pageInfo?.endCursor;
    }

    const data = await getCustomerAddresses({
        first: limit,
        after: currentAfterCursor,
    });

    const addresses = data?.edges || [];
    const totalCount = data?.totalCount || 0;
    const pageInfo = data?.pageInfo;
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="w-full max-w-[1170px]">
            <HideMainNavOnMobile />
            <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
                <MobileNavHeader backUrl="/account" />
            </div>

            <div className="hidden lg:block">
                <AccountBreadcrumbs />
            </div>

            <div className="flex flex-row justify-between items-center mt-5 lg:mt-[10px] mb-6 lg:mb-7_5 pb-2.5 lg:border-none lg:pb-0 gap-4">
                <h1 className="font-outfit font-semibold text-2xl leading-[24px] lg:font-medium lg:text-26 lg:leading-[40px] text-black dark:text-white text-left">
                    Address
                </h1>

                <Link
                    href="/account/addresses/create"
                    className="flex items-center justify-center w-auto px-4 h-10 lg:w-[222px] lg:h-[55px] border border-primary dark:border-primary-soft rounded-full gap-1.5 hover:bg-primary/5 dark:hover:bg-primary-soft/10 transition-colors group flex-shrink-0"
                >
                    <Plus className="w-3 h-[13px] text-primary dark:text-primary-soft group-hover:scale-110 transition-transform" strokeWidth={3} />
                    <span className="font-outfit font-semibold text-sm lg:text-lg text-primary dark:text-primary-soft leading-none">Add Address</span>
                </Link>
            </div>

            {totalCount === 0 ? (
                <div className="flex flex-col items-center justify-center w-full max-w-[1170px] min-h-[528px] gap-4">
                    <div className="relative w-[384px] h-[295px]">
                        <Image
                            src={IMAGES.emptyWishlist}
                            alt="No address found"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="font-outfit font-normal text-xl leading-none text-center text-black dark:text-white">
                        You haven&apos;t added an address to your account yet.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[1170px]">
                        {addresses.map((edge: CustomerEdge<CustomerAddress>) => (
                            <AddressCard key={edge.node._id} address={edge.node} />
                        ))}
                    </div>

                    {totalCount > 0 && (
                        <div className="py-6 flex flex-row justify-between items-center h-10 mt-6">
                            <p className="font-outfit font-normal text-sm leading-[20px] text-black dark:text-white">
                                Showing {(currentPage - 1) * limit + 1} to {Math.min((currentPage - 1) * limit + addresses.length, totalCount)} of {totalCount} entries
                            </p>
                            <ReviewPagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                nextCursor={pageInfo?.endCursor}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
