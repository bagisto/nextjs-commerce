import { ReactNode } from "react";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <div className="mx-auto min-h-[calc(100vh-580px)] w-full">
        {children}
      </div>
      <Footer />
    </main>
  );
}
