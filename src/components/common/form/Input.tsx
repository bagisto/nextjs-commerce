import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { forwardRef } from "react";
import { isArray } from '@/utils/type-guards';
interface InputTextProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  className?: string;
  label: string;
  name: string;
  errorMsg?: string | string[] | Record<string, unknown>;
  defaultValue?: string;
  typeName?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg"; 
  labelPlacement?: "inside" | "outside" | "outside-left";
  rounded?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-sm px-2 py-1",
  md: "text-base px-3 py-2",
  lg: "text-lg px-4 py-3",
};

const roundedClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
};

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      className,
      label,
      name,
      errorMsg,
      defaultValue,
      typeName = "text",
      placeholder,
      size = "sm",
      labelPlacement = "inside",
      rounded = "sm",
      ...rest
    },
    ref
  ) => {
    const hasError = Boolean(errorMsg);

    const borderColorClass = hasError
      ? "border-red-500"
      : "border-gray-300 dark:border-white";

    return (
      <div className={clsx("max-w-full mb-2.5", className)}>
        {labelPlacement !== "inside" && (
          <label
            className={clsx(
              "mb-1 block font-medium text-gray-700 dark:text-white"
            )}
            htmlFor={name}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={clsx(
              "w-full !rounded-[0.62rem] border bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white",
              borderColorClass,
              sizeClasses[size],
              roundedClasses[rounded],
              labelPlacement === "inside"
                ? "placeholder-gray-400 dark:placeholder-gray-300"
                : ""
            )}
            defaultValue={defaultValue}
            id={name}
            name={name}
            placeholder={labelPlacement === "inside" ? label : placeholder}
            type={typeName}
            {...rest}
          />
          {hasError && (
            <ul className="absolute -bottom-8 py-2 text-sm text-red-500">
              {isArray(errorMsg) ? (
                (errorMsg as string[]).map((msg, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <ExclamationCircleIcon className="h-5 w-5" />
                    {msg}
                  </li>
                ))
              ) : (
                <li className="flex items-center gap-1 text-sm">
                  <ExclamationCircleIcon className="size-[18px]" />
                  {typeof errorMsg === "string"
                    ? errorMsg
                    : JSON.stringify(errorMsg)}
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

InputText.displayName = "InputText";

export default InputText;
