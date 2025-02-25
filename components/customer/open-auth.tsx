import { UserIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function OpenAuth({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
      <UserIcon
        className={clsx('h-5 w-20 transition-all ease-in-out hover:scale-110 ', className)}
      />
    </div>
  );
}
