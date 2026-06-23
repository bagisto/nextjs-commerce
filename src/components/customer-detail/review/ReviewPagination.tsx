import AccountPagination from "../AccountPagination";

export default function ReviewPagination(props: {
  totalPages: number;
  currentPage: number;
  nextCursor?: string;
}) {
  return (
    <AccountPagination
      {...props}
      activeClassName="text-black dark:text-white font-bold bg-surface-cool dark:bg-neutral-800"
    />
  );
}
