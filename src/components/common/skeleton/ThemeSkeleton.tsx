
export const ThemeSkeleton = () => {
  const skeletonArray = Array.from({ length: 8 });

  return (
    <section>
      <div className="mx-auto mb-10 w-full px-0 text-center md:max-w-4.5xl md:px-36">
        <div className="mx-auto mb-4 h-10 w-1/2 animate-pulse rounded bg-gray-300 dark:bg-neutral-700" />
        <div className="mx-auto h-5 w-full max-w-xl animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
      </div>

      <div className="w-full pb-6 pt-1">
        <ul className="m-0 grid grid-cols-1 justify-center gap-6 p-0 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
          {skeletonArray.map((_, index) => (
            <li
              key={index}
              className="aspect-[4/5] animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800"
            />
          ))}
        </ul>
      </div>
    </section>
  );
};
