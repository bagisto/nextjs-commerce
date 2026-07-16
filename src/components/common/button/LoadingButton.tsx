import clsx from "clsx";
import LoadingDots from "../icons/LoadingDots";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  className = "",
  title,
  loading = false,
  disabled = false,
  type,
  ...rest
}: ButtonProps) {
  const buttonClasses = clsx(
    "relative flex w-full text-lg cursor-pointer font-outfit font-semibold items-center justify-center rounded-xl bg-primary p-3 tracking-wide text-white",
    "hover:opacity-90",
    {
      "opacity-50 cursor-wait ": loading || disabled,
    },
    className
  );

  return (
    <button
      aria-disabled={loading || disabled}
      aria-label={title}
      className={buttonClasses}
      disabled={loading || disabled}
      type={type ?? "reset"}
      {...rest}
    >
      <div className="relative flex items-center justify-center w-full">
        <span className={clsx(loading ? "invisible" : "visible")}>{title}</span>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            <LoadingDots className="bg-current" />
            <span className="">loading</span>
          </div>
        )}
      </div>
    </button>
  );
}
