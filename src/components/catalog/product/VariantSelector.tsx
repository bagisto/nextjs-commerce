"use client";

import { AttributeData } from "@/types/types";
import { createUrl, getValidTitle } from "@/utils/helper";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function VariantSelector({
  variants,
  setUserInteracted,
}: {
  variants: AttributeData[];
  setUserInteracted: React.Dispatch<React.SetStateAction<boolean>>;
  possibleOptions: Record<string, number[]>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (!variants?.length) return null;

  return (
    <>
      {variants.map((option) => {
        const attributeCode = option.code;
        const _isAlreadySelected = searchParams.has(attributeCode);
        return (
          <dl key={option.id} className="mb-8">
            <dt className="mb-4 text-sm uppercase tracking-wide">
              {getValidTitle(attributeCode)}
            </dt>

            <dd className="flex flex-wrap gap-3">
              {option.options.edges.map(({ node }) => {
                const _optionId = Number(node.id);
                const isActive =
                  searchParams.get(attributeCode) === node.id;
                const _primaryAttributeCode =
                  Array.from(searchParams.keys()).find(
                    (key) => key !== "type"
                  ) ?? null;
                const isAvailable = node?.isValid;
                const nextParams = new URLSearchParams(searchParams.toString());
                nextParams.set(attributeCode, node.id);

                const optionUrl = createUrl(pathname, nextParams);

                return (
                  <button
                    key={node.id}
                    disabled={!isAvailable}
                    onClick={() => {
                      if (!isAvailable) return;
                      router.replace(optionUrl, { scroll: false });
                      setUserInteracted(true);
                    }}
                    className={clsx(
                      "flex min-w-[48px] cursor-pointer items-center justify-center rounded-full bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900",
                      {
                        "cursor-default bg-white ring-2 ring-blue-600": isActive,
                        "ring-[0] transition duration-300 ease-in-out hover:scale-110 hover:border-blue-600 border":
                          !isActive && isAvailable,
                        "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700":
                          !isAvailable,
                      }
                    )}
                  >
                    {node.adminName}
                  </button>
                );
              })}
            </dd>
          </dl>
        );
      })}
    </>
  );
}
