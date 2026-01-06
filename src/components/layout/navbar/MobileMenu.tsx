"use client";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useDisclosure } from "@heroui/react";
import Link from "next/link";
import ThemeSwitcher from "@components/theme/theme-switch";
import { getCookie } from "@utils/getCartToken";
import { IS_GUEST } from "@/utils/constants";





export default function MobileMenu({ menu }: { menu: any }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const IsGuest = getCookie(IS_GUEST)

  return (
    <>
      <button
        onClick={onOpen}
        aria-label="Open mobile menu"
        className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white md:h-9 md:w-9 lg:hidden lg:h-11 lg:w-11"
      >
        <Bars3Icon className="h-4" />
      </button>

      <Drawer
        backdrop="blur"
        hideCloseButton={true}
        isOpen={isOpen}
        radius="none"
        placement="left"
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex w-full items-center justify-between border-b border-neutral-200">
                <button
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                  onClick={onClose}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6" />
                </button>
                <ThemeSwitcher />
              </DrawerHeader>
              <DrawerBody className="px-4 py-4">
                 <ul className="flex w-full flex-col">
                  {menu.map((item: { id: string; name: string; slug: string }) => (
                    <li 
                    key={item?.id + item?.name}
                      className="p-2 text-xl text-black transition-colors hover:text-neutral-500 dark:text-white"
                    >
                      <Link
                        className="text-nowrap relative text-neutral-500 before:absolute before:bottom-0 before:left-0 before:h-px before:w-0 before:bg-current before:transition-all before:duration-300 before:content-[''] hover:text-black hover:before:w-full dark:text-neutral-400 dark:hover:text-neutral-300"
                        href={item.slug ? `/search/${item.slug}` : "/search"}
                        prefetch={true}
                         onClick={onClose}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </DrawerBody>
              <DrawerFooter>
                {!IsGuest ? (
                  <button
                    onClick={onClose}
                    className="h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                  >
                    Log Out
                  </button>
                ) : (
                  <Link className="w-full" href="/customer/login">
                    <button
                      onClick={onClose}
                      className="h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                    >
                      Log In
                    </button>
                  </Link>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
