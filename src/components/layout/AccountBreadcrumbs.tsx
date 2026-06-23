"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IMAGES } from "@/utils/constants";

const routeLabels: Record<string, string> = {
  account: "My Account",
  profile: "Profile",
  orders: "Orders",
  "downloadable-products": "Downloadable Products",
  wishlist: "Wishlist",
  reviews: "Reviews",
  addresses: "Addresses",
  edit: "Edit",
  create: "Create",
  view: "View",
};

export default function AccountBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbItems: { label: string; href: string }[] = [];
  let accumulatedPath = "";

  segments.forEach((segment) => {
    accumulatedPath += "/" + segment;

    const isId = !routeLabels[segment] && (segment.length > 20 || /^\d+$/.test(segment));
    if (isId) return;

    const href = accumulatedPath;

    breadcrumbItems.push({
      label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href: href,
    });
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-[5px] font-outfit mb-2.5 h-[26px]">
      <Link
        href="/"
        className="text-black dark:text-white transition-colors font-medium text-base leading-[26px] capitalize"
      >
        Home
      </Link>

      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={item.href + index}>
            <div className="flex items-center justify-center w-6 h-6">
               <Image 
                  src={IMAGES.arrowRight}
                  alt="separator" 
                  width={24} 
                  height={24}
                  className="dark:invert-0 invert" 
               />
            </div>
            
            {isLast ? (
              <span className="text-selected-black dark:text-overlay-light font-medium text-base leading-[26px] capitalize">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-black dark:text-white transition-colors font-medium text-base leading-[26px] capitalize"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
