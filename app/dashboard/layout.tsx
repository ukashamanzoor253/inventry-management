import type { Metadata } from "next";
import {  Poppins } from "next/font/google";
import "../globals.css";
import Header from "@/components/(main)/header";
import Sidebar from "@/components/(main)/sidebar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});


export const metadata: Metadata = {
  title: "Inventory Management Dashboard",
  description:
    "Professional dashboard for inventory operations and stock tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  
  return (
    <div>
      <div className="min-h-full flex flex-col">
        <div className="min-h-screen bg-slate-100 text-slate-900">
          <div className="relative">
            <div className="relative">
              <Sidebar />
            </div>
            <main className="space-y-6">
              <div className="relative">
                <Header />
              </div>
              <div className="fixed top-[20%] right-0 w-[88%] h-[78%] overflow-auto"><div className="px-[10px]">{children}</div></div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
