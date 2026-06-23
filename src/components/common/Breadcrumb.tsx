import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center font-outfit">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-[8px] text-black dark:text-white font-normal text-base leading-[100%]">
                /
              </span>
            )}
            {isLast ? (
              <span className="text-selected-black dark:text-selected-white font-normal text-base leading-[100%] capitalize">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href || "#"}
                className="text-black dark:text-white transition-colors font-normal text-base leading-[100%] capitalize"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
