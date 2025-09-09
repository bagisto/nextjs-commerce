"use client";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Menu } from "@/lib/bagisto/types";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useDisclosure } from "@heroui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { isObject } from "@/lib/type-guards";
import ThemeSwitch from "./theme-switch";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession();

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
                <ThemeSwitch />
              </DrawerHeader>
              <DrawerBody className="px-4 py-4">
                {menu.length ? (
                  <ul className="flex w-full flex-col">
                    {menu.map((item: Menu) => (
                      <li
                        className="p-2 text-xl text-black transition-colors hover:text-neutral-500 dark:text-white"
                        key={item?.id + item.title}
                      >
                        <Link href={item.path} onClick={onClose}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </DrawerBody>
              <DrawerFooter>
                {isObject(session?.user) ? (
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
