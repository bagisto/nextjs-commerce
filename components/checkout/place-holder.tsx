const FormPlaceHolder = () => {
  return (
    <section className="md:min-w-xl lg:min-w-2xl min-h-[70dvh] w-auto ">
      <div role="status" className="my-12 flex w-full animate-pulse flex-col gap-4">
        <div className="h-12 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <span className="sr-only">Loading...</span>
      </div>
      <div className="flex w-full animate-pulse flex-col gap-3">
        <div className="h-12 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="h-12 w-auto rounded-md bg-gray-200 dark:bg-gray-700"></div>
          ))}
      </div>
    </section>
  );
};
export default FormPlaceHolder;
