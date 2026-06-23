import Image from "next/image";
import { IMAGES } from "@utils/constants";

export default function SearchNoResult({ searchQuery }: { searchQuery?: string }) {
  return (
    <div className="px-4 max-w-screen-2xl mx-auto w-full mt-10">
      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-neutral-900 rounded-[20px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] min-h-[400px]">
        <div className="relative w-[320px] h-[240px] mb-8">
          <Image
            src={IMAGES.noResult}
            alt="No Results Found"
            fill
            className="object-contain opacity-80"
          />
        </div>
        <p className="text-neutral-900 dark:text-white font-outfit text-xl text-center mb-6">
          {searchQuery
            ? `No results found for "${searchQuery}"`
            : "No products found."}
        </p>
      </div>
    </div>
  );
}
