import type { Metadata } from "next";
import {  Poppins, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
    <html
      lang="en"
      className={cn("h-full", "antialiased", poppins.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children} 
      </body>
    </html>
  );
}
