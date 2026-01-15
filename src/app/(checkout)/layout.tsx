import Navbar from "@components/layout/navbar";
import { ReactNode } from "react";
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="block lg:hidden">
        <Navbar />
      </div>
    <main className="mx-auto w-full max-w-screen-2xl px-4 md:px-8 lg:px-16 xl:px-28 3xl:px-0">
      {children}
    </main>
    </>
  );
}
