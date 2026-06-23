"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AccountDrawer from "@/components/customer/AccountDrawer";

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
        user={session.user}
      />
    </div>
  );
}