import clsx from "clsx";

const dots = "mx-[1px] inline-block h-1 w-1 animate-blink rounded-md";

const LoadingDots = ({ className }: { className: string }) => {
  return (
    <span className="mx-2 inline-flex items-center">
      <span className={clsx(dots, className)} />
      {Array(2)
        .fill(0)
        .map((_, i) => (
          <span
            key={i}
            className={clsx(dots, "animation-delay-[200ms]", className)}
          />
        ))}
    </span>
  );
};

export default LoadingDots;
