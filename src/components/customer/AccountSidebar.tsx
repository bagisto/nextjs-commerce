"use client";

import { useEffect } from "react";
import { Avatar } from "@heroui/avatar";
import { 
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/user-slice";
import { IMAGES } from "@/utils/constants";

interface AccountSidebarProps {
  user: any;
}

const Icon = ({ path, isActive }: { path: string, isActive: boolean }) => (
  <div 
    className={clsx(
      "w-6 h-6 transition-colors",
      isActive ? "bg-primary dark:bg-primary-soft" : "bg-black dark:bg-white"
    )}
    style={{
      maskImage: `url(${path})`,
      maskRepeat: "no-repeat",
      maskPosition: "center",
      maskSize: "contain",
      WebkitMaskImage: `url(${path})`,
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      WebkitMaskSize: "contain",
    }}
  />
);

export default function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (user && (!reduxUser?.firstName && !reduxUser?.lastName)) {
      dispatch(setUser({
        ...(reduxUser || {}),
        ...user,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || reduxUser?.name || ""
      }));
    }
  }, [user, reduxUser, dispatch]);

  const activeUser = reduxUser || user;

  const menuItems = [
    { name: "Profile", iconPath: IMAGES.profile, href: "/account/profile" },
    { name: "Orders", iconPath: IMAGES.orders, href: "/account/orders" },
    { name: "Downloadable Products", iconPath: IMAGES.download, href: "/account/downloadable-products" },
    { name: "Wishlist", iconPath: IMAGES.wishlist, href: "/account/wishlist" },
    { name: "Reviews", iconPath: IMAGES.reviews, href: "/account/reviews" },
    { name: "Address", iconPath: IMAGES.address, href: "/account/addresses" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full lg:min-w-[320px] lg:max-w-[350px] shrink-0">
      <div className="bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-md p-6 flex items-center gap-4">
        <Avatar
          src={activeUser?.image || undefined}
          className="w-[65px] h-[65px] rounded-full border-none bg-neutral-100 dark:bg-neutral-800"
          showFallback
          imgProps={{
            className: "object-cover",
          }}
          fallback={<Icon path={IMAGES.profile} isActive={false} />}
        />
        <div className="flex flex-col overflow-hidden">
          <h3 className="font-outfit text-25 font-medium text-black dark:text-white truncate leading">
            Hello! {activeUser?.firstName || (activeUser?.name ? activeUser.name.split(" ")[0] : "User")}
          </h3>
          <p className="font-outfit text-base text-muted dark:text-white truncate">
            {activeUser?.email}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center justify-between transition-all font-outfit text-lg leading-[28px] group w-full lg:w-[350px] h-13 rounded-md pt-3 pb-3 pl-3 lg:pr-3 pr-4 gap-2.5 capitalize border-l-4",
                isActive 
                  ? "bg-overlay-subtle dark:bg-overlay-light-subtle text-primary dark:text-primary-soft font-medium border-l-primary dark:border-l-primary-soft" 
                  : "text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium border-l-transparent"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon path={item.iconPath} isActive={isActive} />
                <span>{item.name}</span>
              </div>
              <ChevronRight 
                size={18} 
                className={clsx(
                  "lg:hidden transition-transform group-hover:translate-x-1",
                  isActive ? "text-primary dark:text-primary-soft" : "text-neutral-400"
                )} 
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
