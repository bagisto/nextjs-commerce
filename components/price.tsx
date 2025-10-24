import clsx from "clsx";

const Price = ({
  amount,
  className,
  currencyCode = "USD",
}: {
  amount: string;
  className?: string;
  currencyCode: string;
} & React.ComponentProps<"p">) => (
  <p className={className} suppressHydrationWarning={true}>
    {`${new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(parseFloat(amount))}`}
  </p>
);

export default Price;
