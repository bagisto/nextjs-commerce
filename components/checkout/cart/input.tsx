import { Input } from '@nextui-org/react';
import clsx from 'clsx';
export default function InputText({
  className,
  label,
  name,
  errorMsg,
  defaultValue
}: {
  className: string;
  label: string;
  name: string;
  errorMsg?: string;
  defaultValue?: string;
}) {
  return (
    <div className={clsx('max-w-full', className)}>
      <Input
        type="text"
        size="sm"
        label={label}
        variant="bordered"
        radius="sm"
        name={name}
        color="primary"
        defaultValue={defaultValue}
        errorMessage={errorMsg && errorMsg}
        isInvalid={!!errorMsg}
        className="max-w-full"
        classNames={{
          base: 'hover:border-primary-500',
          inputWrapper: 'border border-[1px] rounded-md dark:border-gray-700',
          mainWrapper: 'bg-gray-700',
          label: 'text-gray-500'
          // errorMessage: "text-red-500"
        }}
      />
    </div>
  );
}
