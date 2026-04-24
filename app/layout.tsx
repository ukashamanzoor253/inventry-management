import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="min-h-screen bg-slate-100 text-slate-900">
          <div className="relative mx-auto grid min-h-screen max-w-[1700px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
            <div className="relative">
              <Sidebar />
            </div>
            <main className="space-y-6">
              <div className="relative">
                <Header />
              </div>
              <div className="fixed top-[24%] right-0 w-[80%] h-[76%] overflow-auto">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
