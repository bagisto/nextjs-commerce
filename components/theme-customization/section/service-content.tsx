import { FC, JSX } from "react";

import DollerIcon from "@/components/icons/service/doller-icon";
import EarphoneIcon from "@/components/icons/service/easphone-icon";
import ProductIcon from "@/components/icons/service/product-icon";
import TruckIcon from "@/components/icons/service/truck-icon";
import { OptionDataTypes, TranslationsTypes } from "@/lib/bagisto/types";

export interface ServiceContentDataTypes {
  name?: string;
  serviceData: TranslationsTypes[];
}

export interface ServiceContenRenderTypes {
  serviceList: {
    options: OptionDataTypes;
  };
}

const ServiceContent: FC<ServiceContentDataTypes> = ({ serviceData }) => {
  return serviceData?.map((service, index: number) => (
    <ServiceCarouselRender key={index} serviceList={service} />
  ));
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

  return (
    <div className="flex items-center justify-center gap-6 max-lg:flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-x-2.5 max-md:text-center md:gap-10 lg:gap-20">
      {services?.map((list, index: number) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center gap-3 max-md:gap-2.5 max-sm:px-2"
        >
          {iconMapping[list.serviceIcon]}
          <p className="mt-2.5 max-w-[217px] text-center font-outfit text-sm font-medium max-md:mt-0 max-md:text-base max-sm:text-xs">
            {list.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ServiceContent;
