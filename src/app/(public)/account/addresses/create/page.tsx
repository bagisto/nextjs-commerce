import AddressForm from "@/components/customer-detail/addresses/AddressForm";
import AccountBreadcrumbs from "@/components/layout/AccountBreadcrumbs";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

export default function CreateAddressPage() {
    return (
        <div className="w-full max-w-[1170px]">
            <HideMainNavOnMobile />
            <div className="sticky top-0 z-[999] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
                <MobileNavHeader backUrl="/account/addresses" />
            </div>

            <div className="hidden lg:block">
                <AccountBreadcrumbs />
            </div>

            <div className="flex items-center mt-5 lg:mt-2.5 mb-6 lg:mb-7_5 lg:mb-7_5 pb-2.5 lg:border-none lg:pb-0">
                <h1 className="font-outfit font-semibold text-2xl leading-[24px] lg:font-medium lg:text-26 lg:leading-[40px] text-black dark:text-white text-left">
                    Add Address
                </h1>
            </div>

            <div className="w-full">
                <AddressForm />
            </div>
        </div>
    );
}

