import {
  ProductDetailSkeleton,
  RelatedProductSkeleton,
} from "@/components/common/skeleton/ProductSkeleton";
import { HeroCarouselShimmer } from "@/components/common/slider";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col gap-y-4 rounded-lg pb-0 pt-4 sm:gap-y-6 md:py-7.5 lg:flex-row w-full max-w-screen-2xl mx-auto px-4 xss:px-7.5 lg:gap-8">
        <div className="relative h-full w-full max-w-[885px] max-1366:max-w-[650px] max-lg:max-w-full overflow-hidden rounded-2xl">
          <HeroCarouselShimmer />
        </div>
        <div className="basis-full lg:basis-4/6">
          <ProductDetailSkeleton />
        </div>
      </div>
      <div className="w-full max-w-[1550px] mx-auto px-4 mt-20">
        <RelatedProductSkeleton />
      </div>
    </>
  );
}
