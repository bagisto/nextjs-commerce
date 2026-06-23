import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@utils/auth";
import { redirect } from "next/navigation";
import { getCustomerProfile } from "@/utils/bagisto";
import AccountSidebar from "@/components/customer/AccountSidebar";
import AccountLayoutWrapper from "./AccountLayoutWrapper";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/customer/login");
  }

  const user = await getCustomerProfile();

  return (
    <div className="mx-auto max-w-[1920px] w-full py-12 min-h-screen">
      <div className="px-4 xl:px-[185px] pt-7_5">
        <AccountLayoutWrapper sidebar={<AccountSidebar user={user} />}>
          {children}
        </AccountLayoutWrapper>
      </div>
    </div>
  );
}
