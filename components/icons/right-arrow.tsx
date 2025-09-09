import clsx from "clsx";
export default function RightArrowIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      className={clsx("h-4 w-4", props.className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.75 19.5 8.25 12l7.5-7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
