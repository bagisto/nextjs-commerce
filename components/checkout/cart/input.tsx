import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Input } from '@heroui/input';
import clsx from 'clsx';
import { isArray } from 'lib/type-guards';
export default function InputText({
  className,
  label,
  name,
  errorMsg, // Add errorMsg prop to handle error messages
  defaultValue,
  typeName,
  placeholder
}: {
  className: string;
  label: string;
  name: string;
  errorMsg?: [] | any; // Make errorMsg prop optional
  defaultValue?: string;
  typeName?: string;
  placeholder?: string;
}) {
  return (
    <div className={clsx(' max-w-full ', className)}>
      <Input
        type={typeName}
        size="sm"
        label={label}
        variant="bordered"
        radius="sm"
        name={name}
        color={errorMsg ? 'danger' : 'primary'} // Set color to 'danger' if errorMsg is present
        defaultValue={defaultValue}
        className="max-w-full"
        placeholder={placeholder}
        classNames={{
          base: 'hover:border-primary-500',
          inputWrapper: 'border border-[1px] rounded-md dark:border-gray-700',
          mainWrapper: 'bg-gray-700',
          label: 'text-gray-500'
          // errorMessage: "text-red-500"
        }}
      />
      {isArray(errorMsg) && (
        <ul className="py-2 text-sm text-danger">
          {errorMsg?.map((msg: string | any, index: any) => (
            <div key={index} className="flex items-stretch gap-1">
              <ExclamationCircleIcon className="h-5 w-5" />
              <li key={index}>{msg} </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
