"use client";

import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import LogoIcon from "@components/common/icons/LogoIcon";
import ThemeSwitcherWrapper from "@components/theme/theme-switch";

interface MobileNavHeaderProps {
  onBack?: () => void;
  backUrl?: string;
  title?: string;
  variant?: "back" | "close";
  hideBack?: boolean;
}

export default function MobileNavHeader({
  onBack,
  backUrl,
  title,
  variant = "back",
  hideBack = false,
}: MobileNavHeaderProps) {
  return (
    <header className="w-full h-[68px] border-b border-overlay dark:border-dark-primary bg-white dark:bg-surface-darkest pt-3 pr-4 pb-3 pl-4 flex items-center sticky top-0 z-20">
      <div className="flex items-center justify-between w-full h-11 gap-3">
        <div className="flex items-center gap-2 w-auto h-10">
          {!hideBack && (
            <>
              {onBack ? (
                <button
                  onClick={onBack}
                  className="p-1 -ml-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors flex items-center justify-center w-8"
                  aria-label="Go back"
                >
                  {variant === "close" ? (
                    <X size={24} className="text-black dark:text-white" />
                  ) : (
                    <ArrowLeft size={24} className="text-black dark:text-white" />
                  )}
                </button>
              ) : backUrl ? (
                <Link
                  href={backUrl}
                  className="p-1 -ml-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors flex items-center justify-center w-8"
                  aria-label="Go back"
                >
                  <ArrowLeft size={24} className="text-black dark:text-white" />
                </Link>
              ) : (
                <div className="w-8" />
              )}
            </>
          )}

          <div className="flex items-center h-10">
            {title ? (
              <h1 className="font-outfit font-semibold text-2xl text-black dark:text-white leading-none">
                {title}
              </h1>
            ) : (
              <Link href="/" className="flex items-center h-10">
                <LogoIcon className="w-[156.64px] h-10" />
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end w-8">
          <ThemeSwitcherWrapper />
        </div>
      </div>
    </header>
  );
}
