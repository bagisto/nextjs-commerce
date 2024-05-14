import { Select, SelectItem } from '@nextui-org/react';
import { useGlobalContext } from 'app/context/store';
import clsx from 'clsx';
import { CountryArrayDataType } from 'lib/bagisto/types';
export default function Selectbox({
  className,
  countries,
  label,
  errorMsg,
  defaultvalue,
  nameAttr
}: {
  className: string;
  label: string;
  countries: any;
  errorMsg?: string;
  defaultvalue?: string;
  nameAttr?: string;
}) {
  const { setCountryCode } = useGlobalContext();
  const getKeyValue = (countryCode: string) => {
    setCountryCode(countryCode);
  };
  return (
    <div className={clsx('w-full', className)}>
      <Select
        items={countries}
        label={label}
        name={nameAttr}
        variant="bordered"
        color="primary"
        radius="sm"
        autoFocus={false}
        defaultSelectedKeys={[defaultvalue || 'IN']}
        errorMessage={errorMsg && errorMsg}
        isInvalid={!!errorMsg}
        placeholder="Select country/region"
        className={clsx('w-full bg-transparent', className)}
        onChange={(e) => getKeyValue(e.target.value)}
        classNames={{
          label: 'text-gray-500',
          mainWrapper: 'border-none outline-none',
          trigger: 'border border-[0.5px] rounded-md dark:border-gray-700',
          popoverContent: 'bg-white dark:bg-black'
        }}
      >
        {(countries: CountryArrayDataType) => (
          <SelectItem key={countries.code}>{countries.name}</SelectItem>
        )}
      </Select>
    </div>
  );
}
