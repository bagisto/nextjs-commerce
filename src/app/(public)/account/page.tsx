"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { BagistoUser } from "@/types/types";

const AccountDrawer = dynamic(() => import("@/components/customer/AccountDrawer"), {
  ssr: false,
});

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (typeof window !== "undefined" && window.innerWidth >= 1024) {
    redirect("/account/profile");
  }

  if (status === "loading") {
    return null;
  }

  if (!session?.user) {
    redirect("/customer/login");
  }

  return (
    <div className="block lg:hidden">
      <AccountDrawer
        isOpen={true}
        onClose={() => {}}
        user={session.user as unknown as BagistoUser}
      />
    </div>
  );
}