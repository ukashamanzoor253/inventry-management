import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/(main)/header";
import Sidebar from "@/components/(main)/sidebar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inventory Management Dashboard",
  description:
    "Professional dashboard for inventory operations and stock tracking.",
  keywords: ["inventory", "management", "dashboard", "warehouse", "stock"],
  authors: [{ name: "IMS Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${poppins.variable} ${inter.variable} font-sans`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-grid-slate-200/20 bg-[size:20px_20px] pointer-events-none" />
        
        <div className="relative flex min-h-screen">
          {/* Sidebar - Fixed width with responsive behavior */}
          <div className="hidden lg:block fixed left-0 top-0 z-30">
            <Sidebar />
          </div>

          {/* Mobile Sidebar Toggle - Handled inside Sidebar component */}
          <div className="lg:hidden">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 lg:ml-64">
            {/* Header */}
            <div className="fixed top-0 right-0 left-0 lg:left-64 z-20">
              <Header />
            </div>

            {/* Main Content */}
            <main className="pt-24 lg:pt-28 min-h-screen">
              <div className="">
                {/* Page Content */}
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl  border border-slate-200/50 px-4 lg:px-5 pt-6 lg:pt-10 pb-2 lg:pb-4">
                  {children}
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200/80 bg-white/30 backdrop-blur-sm mt-8">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                  <p>© 2024 Inventory Management System. All rights reserved.</p>
                  <div className="flex gap-4">
                    <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}