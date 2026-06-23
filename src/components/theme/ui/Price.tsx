export const Price = ({
  amount,
  className,
  currencyCode = "USD",
  ...rest
}: {
  amount: string | number | undefined;
  className?: string;
  currencyCode?: string;
} & React.ComponentProps<"p">) => (
  <p className={className} suppressHydrationWarning={true} {...rest}>
    {`${new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(parseFloat(String(amount ?? 0)))}`}
  </p>
);
