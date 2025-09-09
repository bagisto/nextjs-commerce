// import { useGlobalContext } from "app/context/store";
export default function SelectBox({
  className,
  countries,
  label,
  errorMsg,
  defaultValue,
  nameAttr,
}: {
  className: string;
  label: string;
  countries: any;
  errorMsg?: [] | any;
  defaultValue?: string;
  nameAttr?: string;
}) {
  // const { setCountryCode } = useGlobalContext();
  // const getKeyValue = (countryCode: string) => {
  //   setCountryCode(countryCode);
  // };
  return null;

  // return (
  //   <div className={clsx("w-full", className)}>
  //     <Select
  //       defaultOpen={false}
  //       items={countries}
  //       color={"default"}
  //       placeholder={`Select ${label}`}
  //       classNames={{
  //         value: "text-gray-700 dark:text-neutral-300",
  //         trigger:
  //           "min-h-12 py-2 border border-gray-300 dark:border-neutral-600 rounded-md",
  //         popoverContent: "bg-neutral-100  dark:bg-neutral-800",
  //         base: "hover:border-primary-500",
  //         mainWrapper: "bg-white dark:bg-neutral-900",
  //         label: "text-neutral-700 dark:text-neutral-300",
  //       }}
  //       variant="bordered"
  //       name={nameAttr}
  //       radius="sm"
  //       size="sm"
  //       defaultSelectedKeys={[defaultValue || "IN"]}
  //       onChange={(e) => getKeyValue(e.target.value)}
  //       renderValue={(items) => (
  //         <div className="flex flex-wrap gap-2">
  //           {items.map((item) => (
  //             <Chip key={item.key}>{item.data?.name}</Chip>
  //           ))}
  //         </div>
  //       )}
  //     >
  //       {(countries: CountryArrayDataType) => (
  //         <SelectItem key={countries.code}> {countries.name}</SelectItem>
  //       )}
  //     </Select>
  //     {isArray(errorMsg) && (
  //       <ul className="py-2 text-sm text-danger">
  //         {errorMsg?.map((msg: string | any, index: any) => (
  //           <div key={index} className="flex items-stretch gap-1">
  //             <ExclamationCircleIcon className="h-5 w-5" />
  //             <li key={index} className="text-sm italic">
  //               {msg}{" "}
  //             </li>
  //           </div>
  //         ))}
  //       </ul>
  //     )}
  //   </div>
  // );
}
