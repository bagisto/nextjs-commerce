import clsx from "clsx";
import { forwardRef } from "react";

const CheckBox = forwardRef<HTMLInputElement, any>(
  ({ id, label, name, className, defaultValue, ...rest }, ref) => {
    return (
      <div className={clsx("inline-flex items-center", className)}>
        <label className="relative flex cursor-pointer items-center gap-x-2">
          <input
            ref={ref}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow transition-all checked:border-blue-600 checked:bg-blue-600 hover:shadow-md"
            defaultChecked={defaultValue}
            id={id}
            name={name}
            type="checkbox"
            {...rest}
          />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 peer-checked:opacity-100">
            <svg
              className="h-3.5 w-3.5"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                fillRule="evenodd"
              />
            </svg>
          </span>
        </label>
        <span className="ml-3 text-neutral-400 dark:text-white">{label}</span>
      </div>
    );
  },
);

CheckBox.displayName = "CheckBox";
export default CheckBox;
