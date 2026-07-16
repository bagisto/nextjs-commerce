"use client";

import { AttributeData, AttributeOptionNode } from "@/types/types";
import { getValidTitle } from "@/utils/helper";
import clsx from "clsx";

export function VariantSelector({
  variants,
  selectedOptions,
  onSelectOption,
}: {
  variants: AttributeData[];
  selectedOptions: Record<string, string>;
  onSelectOption: (attributeCode: string, optionId: string) => void;
}) {
  if (!variants?.length) return null;

  return (
    <>
      {variants.map((option , index : number) => {
        const attributeCode = option.code;
        return (
          <dl key={`${option.id} + ${index}` } className="mb-8">
            <dt className="mb-4 text-sm capitalize tracking-wide">
              {getValidTitle(attributeCode)}
            </dt>

            <dd className="flex flex-wrap gap-3">
              {(option.options as AttributeOptionNode[]).map((node) => {
                const isActive = selectedOptions[attributeCode] === String(node.id);
                const isAvailable = node?.isValid;

                return (
                  <button
                    key={node.id}
                    disabled={!isAvailable}
                    onClick={() => {
                      if (!isAvailable) return;
                      onSelectOption(attributeCode, String(node.id));
                    }}
                    className={clsx(
                      "flex min-w-12 cursor-pointer items-center justify-center rounded-lg bg-neutral-100 px-3.5 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-800",
                      {
                        "cursor-default ring-2 ring-primary text-primary": isActive,
                        "ring-[0] transition duration-300 ease-in-out hover:border-primary":
                          !isActive && isAvailable,
                        "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-selected-black ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-selected-white dark:ring-neutral-700 before:dark:bg-neutral-700":
                          !isAvailable,
                      }
                    )}
                  >
                    {node.label || node.adminName}
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
