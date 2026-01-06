import clsx from "clsx";
const SeparatorIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      className={clsx("h-3 w-3", props.className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SeparatorIcon;
