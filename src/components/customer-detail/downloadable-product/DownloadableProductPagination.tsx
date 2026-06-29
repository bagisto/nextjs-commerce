import AccountPagination from "../AccountPagination";

export default function DownloadableProductPagination(props: {
  totalPages: number;
  currentPage: number;
  nextCursor?: string;
}) {
  return (
    <AccountPagination
      {...props}
      inactiveClassName="text-selected-black dark:text-selected-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium"
    />
  );
}
