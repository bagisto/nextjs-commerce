"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ConfigurableProductData,
  ConfigurableProductIndexData,
} from "@/lib/bagisto/types";
import { createUrl } from "@/lib/utils";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean; // ie. { color: 'Red', size: 'Large', ... }
};

export function VariantSelector({
  variants,
  index,
}: {
  variants: ConfigurableProductData[];
  index: ConfigurableProductIndexData[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !variants?.length ||
    (variants.length === 1 && variants[0]?.options.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = index?.map((variant) => ({
    id: variant.id,
    availableForSale: true,
    // Adds key / value pairs for each variant (ie. "color": "Black" and "size": 'M").
    ...variant?.attributeOptionIds.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.attributeCode.toLowerCase()]: option.attributeOptionId,
      }),
      {}
    ),
  }));

  return variants.map((option) => (
    <dl key={option.id} className="mb-8">
      <dt className="mb-4 text-sm uppercase tracking-wide">{option.label}</dt>
      <dd className="flex flex-wrap gap-3">
        {option.options.map((value) => {
          const optionNameLowerCase = option.code.toLowerCase();

          // Base option params on current params so we can preserve any other param state in the url.
          const optionSearchParams = new URLSearchParams(
            searchParams.toString()
          );

          // Update the option params using the current option to reflect how the url *would* change,
          // if the option was clicked.
          optionSearchParams.set(optionNameLowerCase, value?.id);

          const optionUrl = createUrl(pathname, optionSearchParams);

          // In order to determine if an option is available for sale, we need to:
          //
          // 1. Filter out all other param state
          // 2. Filter out invalid options
          // 3. Check if the option combination is available for sale
          //
          // This is the "magic" that will cross check possible variant combinations and preemptively
          // disable combinations that are not available. For example, if the color gray is only available in size medium,
          // then all other sizes should be disabled.
          const filtered = Array.from(optionSearchParams.entries()).filter(
            ([key, value]) =>
              variants.find(
                (option) =>
                  option.code.toLowerCase() === key &&
                  option.options.some((option) => option.id === value)
              )
          );

          const isAvailableForSale = combinations.find((combination) =>
            filtered.every(
              ([key, value]) =>
                combination[key] === value && combination.availableForSale
            )
          );

          // The option is active if it's in the url params.
          const isActive = searchParams.get(optionNameLowerCase) === value?.id;

          return (
            <button
              key={value?.label}
              aria-disabled={!isAvailableForSale}
              className={clsx(
                "flex min-w-[48px] cursor-pointer items-center justify-center rounded-full bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900",
                {
                  "cursor-default bg-white ring-2 ring-blue-600": isActive,
                  "ring-[0] transition duration-300 ease-in-out hover:scale-110 hover:border-blue-600 border":
                    !isActive && isAvailableForSale,
                  "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700":
                    !isAvailableForSale,
                }
              )}
              disabled={!isAvailableForSale}
              title={`${option.label} ${value.label}${
                !isAvailableForSale ? " (Out of Stock)" : ""
              }`}
              onClick={() => {
                router.replace(optionUrl, { scroll: false });
              }}
            >
              {value?.label}
            </button>
          );
        })}
      </dd>
    </dl>
  ));
}
