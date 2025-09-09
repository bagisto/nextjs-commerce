// import { useGlobalContext } from "app/context/store";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import InputText from "./cart/input";
import { isArray } from "@/lib/type-guards";
import { Select, SelectItem } from "@heroui/select";
import clsx from "clsx";
import { Chip } from "@heroui/chip";
import { StateArrayDataType } from "@/lib/bagisto/types";

export default function SelectBox({
  className,
  countries,
  label,
  errorMsg,
  defaultValue,
  name,
}: {
  className: string;
  label: string;
  countries: any;
  errorMsg?: [] | any;
  defaultValue?: string;
  name: string;
}) {
  // const { countryCode } = useGlobalContext();
  // const stateArray = countries.find(
  //   (country: CountryArrayDataType) => country.code === countryCode
  // );
  const countryStates = "UP"; //stateArray?.states;
  return (
    <>
      {isArray(countryStates) ? (
        <div className={clsx("w-full", className)}>
          <Select
            // items={countryStates}
            color={"default"}
            placeholder={`Select ${label}`}
            name={name}
            variant="bordered"
            radius="sm"
            size="sm"
            defaultSelectedKeys={[defaultValue || "UP"]}
            errorMessage={errorMsg && errorMsg}
            autoFocus={false}
            classNames={{
              value: "text-gray-700 dark:text-neutral-300",
              trigger:
                "min-h-12 py-2 border border-gray-300 dark:border-neutral-600 rounded-md",
              popoverContent: "bg-neutral-100 dark:bg-neutral-800",
              base: "hover:border-primary-500",
              mainWrapper: "bg-white dark:bg-neutral-900",
              label: "text-neutral-700 dark:text-neutral-300",
            }}
            renderValue={(items) => (
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Chip key={item.key}>{item.data?.defaultName}</Chip>
                ))}
              </div>
            )}
          >
            {(States: StateArrayDataType) => (
              <SelectItem key={States.code}>{States.defaultName}</SelectItem>
            )}
          </Select>
          {isArray(errorMsg) && (
            <ul className="py-2 text-sm text-danger">
              {errorMsg?.map((msg: string | any, index: any) => (
                <div key={index} className="flex items-stretch gap-1">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  <li key={index} className="text-sm italic">
                    {msg}{" "}
                  </li>
                </div>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <InputText
          label={label}
          size="md"
          name={name}
          defaultValue={defaultValue}
          errorMsg={errorMsg}
          className={clsx("max-w-full bg-transparent", className)}
        />
      )}
    </>
  );
}
