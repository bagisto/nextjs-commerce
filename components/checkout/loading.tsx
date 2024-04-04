const Loading = () => {
  return (
    <section className="mr-auto hidden h-full w-full max-w-xl flex-col px-4 pt-4 lg:flex lg:max-w-xl">
      <div role="status" className="my-12 flex w-full animate-pulse flex-col gap-4">
        <div className=" h-24 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <div className=" h-8 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <div className=" h-8 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <span className="sr-only">Loading...</span>
      </div>
      <div className="flex w-full animate-pulse flex-col gap-3">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="h-8 w-auto rounded-md bg-gray-200 dark:bg-gray-700"></div>
          ))}
      </div>
    </section>
  );
};

export default Loading;
