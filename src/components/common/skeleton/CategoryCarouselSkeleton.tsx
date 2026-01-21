export const CategoryCarouselSkeleton = () => {
    return (
        <section className="pt-8 sm:pt-12 lg:pt-20">
            <div className="md:max-w-4.5xl mx-auto mb-10 w-auto text-center md:px-36">
                {/* Heading skeleton */}
                <div className="mb-2 mx-auto h-8 w-64 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900 md:h-10 md:w-80" />

                {/* Description skeleton */}
                <div className="mx-auto mt-3 h-4 w-full max-w-2xl animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900 md:h-5" />
                <div className="mx-auto mt-2 h-4 w-3/4 max-w-xl animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-900 md:h-5" />
            </div>

            <div className="w-full overflow-x-auto overflow-y-hidden">
                <ul className="m-0 grid grid-cols-1 gap-7 p-0 xss:grid-cols-2 sm:grid-cols-3">
                    {[1, 2, 3].map((index) => (
                        <li
                            key={index}
                            className="relative aspect-498/665 h-full w-full max-w-[498px] flex-none overflow-hidden rounded-[18px]"
                        >
                            <div className="relative h-full w-full animate-pulse rounded-[18px] bg-neutral-100 dark:bg-neutral-900">
                                {/* Category label skeleton */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="h-6 w-32 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
