'use client';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
function SubmitButton({ buttonName, redirectNav }: { buttonName: string; redirectNav: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(redirectNav)}
      aria-label={buttonName}
      type="button"
      className={clsx(
        ' my-3 w-auto items-center justify-center rounded-md border-white bg-blue-600 px-12 py-4 text-sm font-bold tracking-wide text-white',
        {
          'hover:opacity-90': true
        }
      )}
    >
      {buttonName}
    </button>
  );
}

export function EventButton({ buttonName, redirect }: { buttonName: string; redirect: string }) {
  return (
    <>
      <SubmitButton buttonName={buttonName} redirectNav={redirect} />
    </>
  );
}
