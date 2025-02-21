'use client';
import clsx from 'clsx';
import LoadingDots from 'components/loading-dots';
import { useFormStatus } from 'react-dom';
function SubmitButton({
  availableForSale,
  buttonName
}: {
  availableForSale: boolean;
  buttonName: string;
}) {
  const { pending } = useFormStatus();
  const buttonClasses =
    'relative w-full text-sm font-bold border-white items-center justify-center rounded-md bg-blue-600 py-4 px-4 sm:px-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Processing...
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Proceed to checkout"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      <div className="absolute left-0 ml-4">
        {pending && <LoadingDots className="mb-3 bg-white" />}
      </div>
      {buttonName}
    </button>
  );
}

export function ProceedToCheckout({ buttonName }: { buttonName: string }) {
  const { pending } = useFormStatus();
  return <SubmitButton buttonName={buttonName} availableForSale={!pending} />;
}
