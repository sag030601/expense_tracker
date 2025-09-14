// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import Providers from "./components/providers";

export const metadata = {
  title: "Finance Tracker",
  description: "Track your income and expenses easily",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        {/* <header className="bg-white shadow px-6 py-4 flex justify-between">
          <h1 className="text-xl font-bold">💸 Finance Tracker</h1>
          <nav className="space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          </nav>
        </header> */}
        
        <Providers>
          <main>{children}</main>
        </Providers>
        
      </body>
    </html>
  );
}
