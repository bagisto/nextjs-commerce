import { Shimmer } from "@/components/common/Shimmer";

export function HeroCarouselShimmer() {
  return (
    <div className="group relative overflow-hidden">
      <div
        className="group relative h-full max-h-[738px] w-full overflow-hidden rounded-2xl"
        style={{
          aspectRatio: "380/316",
        }}
      >
        <div className="relative h-full w-full">
          <Shimmer
            className="absolute inset-0 z-10 h-full w-full"
            rounded="lg"
          />
        </div>
      </div>
    </div>
  );
}

export function HeroCarouselThumbnailShimmer({
  count = 3,
}: {
  count?: number;
}) {
  return (
    <ul className="fade-in my-3 flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden py-1 sm:my-7 lg:mb-0">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="relative aspect-square w-16 md:w-32 flex-shrink-0"
        >
          <Shimmer className="h-full w-full" rounded="lg" />
        </li>
      ))}
    </ul>
  );
}
