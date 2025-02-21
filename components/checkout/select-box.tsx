import { Select, SelectItem } from '@heroui/select';
import { useGlobalContext } from 'app/context/store';
import clsx from 'clsx';
import { CountryArrayDataType } from 'lib/bagisto/types';
export default function SelectBox({
  className,
  countries,
  label,
  errorMsg,
  defaultValue,
  nameAttr
}: {
  className: string;
  label: string;
  countries: any;
  errorMsg?: string;
  defaultValue?: string;
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
        color={'default'}
        radius="sm"
        size="sm"
        autoFocus={false}
        defaultSelectedKeys={[defaultValue || 'IN']}
        errorMessage={errorMsg && errorMsg}
        isInvalid={!!errorMsg}
        placeholder="Select country/region"
        className={clsx('w-full bg-transparent', className)}
        onChange={(e) => getKeyValue(e.target.value)}
        classNames={{
          base: 'text-black dark:text-gray-500',
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
