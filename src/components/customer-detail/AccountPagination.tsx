"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

export default function AccountPagination({
  totalPages,
  currentPage,
  nextCursor,
  activeClassName = "text-black dark:text-white font-medium bg-surface-cool dark:bg-neutral-800",
  inactiveClassName = "text-selected-black dark:text-selected-white hover:bg-neutral-50 dark:hover:bg-neutral-800",
}: {
  totalPages: number;
  currentPage: number;
  nextCursor?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number, cursor?: string) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    if (cursor && page === currentPage + 1) {
      params.set("cursor", cursor);
    } else {
      params.delete("cursor");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    const pages = [];

    const startPage = Math.max(1, Math.min(currentPage, totalPages - 2));
    const endPage = Math.min(totalPages, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={clsx(
            "flex-1 h-full flex items-center justify-center border-r border-border dark:border-dark-grey font-outfit text-13 cursor-pointer transition-colors",
            i === currentPage ? activeClassName : inactiveClassName,
            i === startPage + 2 ? "hidden sm:flex" : "flex",
          )}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center w-[160px] h-10 border border-border dark:border-dark-grey rounded-md overflow-hidden bg-white dark:bg-surface-dark mx-auto sm:mx-0">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          "flex-1 h-full flex items-center justify-center border-r border-border dark:border-dark-grey transition-colors",
          currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx("transition-colors", currentPage === 1 ? "text-light-primary dark:text-dark-primary" : "text-light-secondary dark:text-white")}>
          <path d="M13.2929 16.2929L9.70711 12.7071C9.31658 12.3166 9.31658 11.6834 9.70711 11.2929L13.2929 7.70711C13.9229 7.07714 15 7.52331 15 8.41421L15 15.5858C15 16.4767 13.9229 16.9229 13.2929 16.2929Z" fill="currentColor"/>
        </svg>
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageChange(currentPage + 1, nextCursor)}
        disabled={currentPage === totalPages}
        className={clsx(
          "flex-1 h-full flex items-center justify-center transition-colors",
          currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx("transition-colors", currentPage === totalPages ? "text-light-primary dark:text-dark-primary" : "text-light-secondary dark:text-white")}>
          <path d="M10.7071 7.70711L14.2929 11.2929C14.6834 11.6834 14.6834 12.3166 14.2929 12.7071L10.7071 16.2929C10.0771 16.9229 9 16.4767 9 15.5858L9 8.41421C9 7.52331 10.0771 7.07714 10.7071 7.70711Z" fill="currentColor"/>
      </svg>
      </button>
    </div>
  );
}
