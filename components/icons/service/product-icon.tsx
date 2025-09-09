const ProductIcon = () => {
  return (
    <svg
      className="fill-white stroke-neutral-900 dark:fill-neutral-900 dark:stroke-neutral-300"
      fill="none"
      height="60"
      viewBox="0 0 60 60"
      width="60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="59" rx="29.5" width="59" x="0.5" y="0.5" />
      <rect height="59" rx="29.5" width="59" x="0.5" y="0.5" />
      <path
        strokeLinejoin="round"
        d="M19 24V42H43V24M19 24L21.4 18H40.6L43 24M19 24H27.4M43 24H34.6M34.6 24V31.2L32.8 29.7857L31 28.3714L27.4 31.2V24M34.6 24H27.4"
        // stroke="#060C3B"
        strokeWidth="2"
      />
    </svg>
  );
};

export default ProductIcon;
