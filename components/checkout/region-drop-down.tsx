import { Select, SelectItem } from '@heroui/select';
import { useGlobalContext } from 'app/context/store';
import clsx from 'clsx';
import { CountryArrayDataType, StateArrayDataType } from 'lib/bagisto/types';
import { isArray } from 'lib/type-guards';
import InputText from './cart/input';
export default function SelectBox({
  className,
  countries,
  label,
  errorMsg,
  defaultValue
}: {
  className: string;
  label: string;
  countries: any;
  errorMsg?: string;
  defaultValue?: string;
}) {
  const { countryCode } = useGlobalContext();
  const stateArray = countries.find(
    (country: CountryArrayDataType) => country.code === countryCode
  );
  const countryStates = stateArray?.states;
  return isArray(countryStates) ? (
    <div className={clsx('w-full', className)}>
      <Select
        items={countryStates}
        label={label}
        color={'default'}
        placeholder="Select State"
        name="state"
        variant="bordered"
        radius="sm"
        size="sm"
        defaultSelectedKeys={[defaultValue || 'AP']}
        errorMessage={errorMsg && errorMsg}
        isInvalid={!!errorMsg}
        className={clsx('w-full bg-transparent', className)}
        autoFocus={false}
        classNames={{
          label: 'text-gray-500',
          mainWrapper: 'border-none outline-none',
          trigger: 'border border-[0.5px] rounded-md dark:border-gray-700',
          popoverContent: 'bg-white dark:bg-black'
        }}
      >
        {(States: StateArrayDataType) => (
          <SelectItem key={States.code}>{States.defaultName}</SelectItem>
        )}
      </Select>
    </div>
  ) : (
    <InputText
      label={label}
      name="state"
      defaultValue={defaultValue}
      errorMsg={errorMsg}
      className={clsx('max-w-full bg-transparent', className)}
    />
  );
}
