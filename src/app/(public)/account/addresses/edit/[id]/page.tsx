import { getCustomerAddress } from "@/utils/bagisto";
import AddressForm from "../../../../../../components/customer-detail/addresses/AddressForm";
import { notFound } from "next/navigation";
import AccountBreadcrumbs from "@/components/layout/AccountBreadcrumbs";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

export default async function EditAddressPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const address = await getCustomerAddress(id);

    if (!address) {
        return notFound();
    }

    return (
        <div className="w-full max-w-[1170px]">
            <HideMainNavOnMobile />
            <div className="sticky top-0 z-[999] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
                <MobileNavHeader backUrl="/account/addresses" />
            </div>

            <div className="hidden lg:block">
                <AccountBreadcrumbs />
            </div>

            <div className="flex items-center mt-5 lg:mt-7_5 mb-6 lg:mb-7_5 pb-2.5 lg:border-none lg:pb-0">
                <h1 className="font-outfit font-semibold text-2xl leading-[24px] lg:font-medium lg:text-26 lg:leading-[40px] text-black dark:text-white text-left">
                    Edit Address
                </h1>
            </div>

            <div className="w-full">
                <AddressForm initialData={address} />
            </div>
        </div>
    );
}