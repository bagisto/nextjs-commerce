"use client";

import { FC, JSX } from "react";
import DollerIcon from "@components/common/icons/service/DollerIcon";
import EarphoneIcon from "@components/common/icons/service/EarphoneIcon";
import ProductIcon from "@components/common/icons/service/ProductIcon";
import TruckIcon from "@components/common/icons/service/TruckIcon";
import { OptionDataTypes } from "@/types/types";
import { ThemeCustomizationTranslationNode } from "@/types/theme/theme-customization";
import { usePathname } from "next/navigation";

export interface ServiceContentDataTypes {
  name?: string;
  serviceData: ThemeCustomizationTranslationNode[];
}

export interface ServiceContenRenderTypes {
  serviceList: {
    options: OptionDataTypes;
  };
}

const ServiceContent: FC<ServiceContentDataTypes> = ({ serviceData }) => {
  return serviceData?.slice(0, 1)?.map((service, index: number) => {
    const options =
      typeof service.options === "string"
        ? JSON.parse(service.options)
        : service.options;

    return <ServiceCarouselRender key={index} serviceList={{ options }} />;
  });
};

const iconMapping: Record<string, JSX.Element> = {
  "icon-truck": <TruckIcon />,
  "icon-product": <ProductIcon />,
  "icon-dollar-sign": <DollerIcon />,
  "icon-support": <EarphoneIcon />,
};

const ServiceCarouselRender: FC<ServiceContenRenderTypes> = ({
  serviceList,
}) => {
  const { options } = serviceList;
  const { services } = options;
  const pathname = usePathname();

  // Don't render service content on customer auth pages
  if (
    pathname === "/customer/login" ||
    pathname === "/customer/register" ||
    pathname === "/customer/forget-password"
  ) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-6 max-lg:flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-8 max-md:text-center md:gap-10 lg:gap-20">
      {services?.map((list, index: number) => {
        const iconKey = list?.service_icon;

        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-3 max-md:gap-3 max-md:px-4 max-md:py-2"
          >
            {iconMapping[iconKey]}
            <p className="mt-2.5 max-w-[217px] text-center font-outfit text-sm font-medium max-md:mt-0 max-md:text-base max-sm:text-xs">
              {list.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceContent;
