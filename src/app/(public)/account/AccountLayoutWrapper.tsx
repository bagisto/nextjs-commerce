import React from "react";

interface AccountLayoutWrapperProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function AccountLayoutWrapper({ sidebar, children }: AccountLayoutWrapperProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-7_5 items-start">
      <div className="hidden lg:block w-full lg:min-w-[320px] lg:max-w-[350px] shrink-0 sticky top-[100px] z-20">
        {sidebar}
      </div>

      <main className="flex-1 min-w-0 w-full">
        {children}
      </main>
    </div>
  );
}
