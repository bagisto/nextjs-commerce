'use client';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { useFormStatus } from 'react-dom';
const LoadingDots = dynamic(() => import('components/loading-dots'), { ssr: false });
export function LoadingButton({ buttonName }: { buttonName: string }) {
  const { pending } = useFormStatus();
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-md bg-blue-600 p-3 tracking-wide text-white';

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      <div className="mx-2">
        {pending ? (
          <div className="flex items-center justify-center">
            <p>Loading</p>
            <LoadingDots className="bg-white" />
          </div>
        ) : (
          <p> {buttonName}</p>
        )}
      </div>
    </button>
  );
}
