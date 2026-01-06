"use client";

import { createUrl } from "@/utils/helper";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function Pagination({
  itemsPerPage,
  itemsTotal,
  currentPage,
  nextCursor,
}: {
  itemsPerPage: number;
  itemsTotal: number;
  currentPage: number;
  nextCursor?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();

  const pageCount = Math.ceil(itemsTotal / itemsPerPage);

  const handlePageClick = (page: number) => {
    if (page < 0 || page >= pageCount) return; 

    const params = new URLSearchParams(currentParams.toString());

    params.set("page", String(page + 1));

    if (page === currentPage + 1 && nextCursor) {
      params.set("cursor", nextCursor);
    } else {
      params.delete("cursor");
    }

    const newUrl = createUrl(pathname, params);
    router.replace(newUrl);
  };

  const renderDots = () => {
    const dots = [];
    const maxVisiblePages = 5;

    if (pageCount <= maxVisiblePages) {
      for (let i = 0; i < pageCount; i++) {
        dots.push(renderPageButton(i));
      }
    } else {
      const halfMax = Math.floor(maxVisiblePages / 2);
      const start = Math.max(0, currentPage - halfMax);
      const end = Math.min(pageCount, start + maxVisiblePages);

      if (start > 0) {
        dots.push(renderPageButton(0));
        if (start > 1) {
          dots.push(
            <li key="dot-start" className="pagination-dot">...</li>
          );
        }
      }

      for (let i = start; i < end; i++) {
        dots.push(renderPageButton(i));
      }

      if (end < pageCount) {
        if (end < pageCount - 1) {
          dots.push(
            <li key="dot-end" className="pagination-dot">...</li>
          );
        }
        dots.push(renderPageButton(pageCount - 1));
      }
    }

    return dots;
  };

  const renderPageButton = (pageIndex: number) => (
    <li
      key={pageIndex}
      onClick={() => handlePageClick(pageIndex)}
      className="rounded-sm cursor-pointer"
    >
      <button
        className={`
          flex h-10 w-10 items-center justify-center text-lg rounded-sm duration-300 cursor-pointer
          ${
            pageIndex === currentPage
              ? "border !border-gray-300 dark:border-gray-700"
              : "text-gray-500 dark:!text-gray-400 hover:border-gray-500 dark:hover:border-gray-700"
          }
        `}
        aria-label={`Goto Page ${pageIndex + 1}`}
        aria-current={pageIndex === currentPage}
      >
        {pageIndex + 1}
      </button>
    </li>
  );

  return (
    <ul
      className="mx-auto h-10 gap-x-2 text-base flex justify-center"
      role="navigation"
      aria-label="Pagination"
    >
      <li
        key="prev"
        onClick={() => handlePageClick(currentPage - 1)}
        className={clsx(
          "cursor-pointer rounded-lg hover:text-gray-700",
          currentPage > 0 ? "block cursor-pointer" : ""
        )}
      >
        <button
          className={clsx(
            "ml-0 flex h-10 items-center justify-center px-2 leading-tight",
            currentPage > 0 ? "cursor-pointer" : "cursor-not-allowed"
          )}
          aria-label="Previous page"
          disabled={currentPage <= 0}
        >
          <ChevronLeftIcon className="h-5" />
        </button>
      </li>

      {renderDots()}

      <li
        key="next"
        onClick={() => handlePageClick(currentPage + 1)}
        className={clsx(
          "rounded-lg hover:text-gray-700",
          currentPage < pageCount - 1 ? "block cursor-pointer" : ""
        )}
      >
        <button
          className={clsx(
            "ml-0 flex h-10 items-center justify-center px-2 leading-tight",
            currentPage < pageCount - 1 ? "cursor-pointer" : "cursor-not-allowed"
          )}
          aria-label="Next page"
          disabled={currentPage >= pageCount - 1}
        >
          <ChevronRightIcon className="h-5" />
        </button>
      </li>
    </ul>
  );
}
