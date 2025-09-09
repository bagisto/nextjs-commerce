"use client";
import { createUrl } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function Pagination({
  itemsPerPage,
  itemsTotal,
  currentPage,
}: {
  itemsPerPage: number;
  itemsTotal: number;
  currentPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const q = currentParams.get("q");
  const sort = currentParams.get("sort");
  const pageCount = Math.ceil(itemsTotal / itemsPerPage);

  const handlePageClick = (page: number) => {
    const newPage = Math.ceil(page + 1);
    let newUrl = createUrl(
      pathname,
      new URLSearchParams({
        ...(q && { q }),
        ...(sort && { sort }),
      })
    );
    if (page !== 0) {
      newUrl = createUrl(
        pathname,
        new URLSearchParams({
          ...(q && { q }),
          ...(sort && { sort }),
          page: newPage.toString(),
        })
      );
    }
    router.replace(newUrl);
  };

  // Function to generate dots for pagination
  const renderDots = () => {
    const dots = [];
    const maxVisiblePages = 5; // Adjust this number based on your design

    if (pageCount <= maxVisiblePages) {
      // If total pages are less than or equal to maxVisiblePages, show all pages
      for (let i = 0; i < pageCount; i++) {
        dots.push(renderPageButton(i));
      }
    } else {
      // Show dot pagination with ellipses
      const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
      const start = Math.max(0, currentPage - halfMaxVisiblePages);
      const end = Math.min(pageCount, start + maxVisiblePages);

      if (start > 0) {
        dots.push(renderPageButton(0));
        if (start > 1) {
          dots.push(
            <li key="dot-start" className="pagination-dot">
              ...
            </li>
          );
        }
      }

      for (let i = start; i < end; i++) {
        dots.push(renderPageButton(i));
      }

      if (end < pageCount) {
        if (end < pageCount - 1) {
          dots.push(
            <li key="dot-end" className="pagination-dot">
              ...
            </li>
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
      className={`rounded-sm max-w-10 max-h-10  text-gray-500 font-normal duration-300 hover:text-black text-lg dark:border-gray-700  dark:text-gray-400  dark:hover:text-white [&.active]:font-normal dark:[&.active]:text-white [&.active]:text-black [&.active]:border [&.active]:border-gray-200 cursor-pointer ${
        pageIndex === currentPage ? " active " : ""
      }`}
    >
      <button
        className={`ml-0 cursor-pointer flex h-10 items-center justify-center px-4 leading-tight ${
          pageIndex === currentPage ? " font-normal " : ""
        }`}
        aria-label={`Goto Page ${pageIndex + 1}`}
        aria-current={pageIndex === currentPage}
        data-selected={pageIndex}
      >
        {pageIndex + 1}
      </button>
    </li>
  );

  return (
    <ul
      className="mx-auto inline h-10 gap-x-2 text-base sm:flex"
      role="navigation"
      aria-label="Pagination"
    >
      <li
        key="prev"
        onClick={() => handlePageClick(currentPage - 1)}
        className={clsx(
          "cursor-pointer rounded-lg  text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white",
          currentPage > 0 ? " block cursor-pointer" : " "
        )}
      >
        <button
          className={clsx(
            "ml-0 flex h-10 items-center justify-center px-2 leading-tight",
            currentPage > 0 ? " cursor-pointer" : " cursor-not-allowed"
          )}
          aria-label="Previous page"
          disabled={!(currentPage > 0)}
          data-selected={currentPage}
        >
          <ChevronLeftIcon className="h-5" />
        </button>
      </li>
      {renderDots()}
      <li
        key="next"
        onClick={() => handlePageClick(currentPage + 1)}
        className={clsx(
          "rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white",
          currentPage < pageCount - 1 ? " block cursor-pointer" : " "
        )}
      >
        <button
          className={clsx(
            "ml-0 flex h-10 items-center justify-center px-2 leading-tight",
            currentPage < pageCount - 1
              ? " cursor-pointer"
              : " cursor-not-allowed"
          )}
          aria-label="Next page"
          data-selected={currentPage + 1}
          disabled={!(currentPage < pageCount - 1)}
        >
          <ChevronRightIcon className="h-5" />
        </button>
      </li>
    </ul>
  );
}
