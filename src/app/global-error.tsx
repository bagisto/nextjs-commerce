"use client";


export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
          <h2 className="text-xl font-bold">Oh no!</h2>
          <p className="my-2">
            Something went wrong. This could be a temporary issue, please try
            your action again.
          </p>
          <button
            type="button"
            className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-primary p-4 tracking-wide text-white hover:opacity-90"
            onClick={() => reset()}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
