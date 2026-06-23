
export default function ProductLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-white dark:bg-neutral-900 transition-colors duration-300">
      <div className="relative w-10 h-10">
        <div className="w-10 h-10 rounded-full border-[3px] border-neutral-200 dark:border-neutral-700" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border-[3px] border-accent border-t-transparent animate-spin" />
      </div>
    </div>
  );
}
