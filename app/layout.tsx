// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensure you have standard Tailwind directives here
import { Sidebar } from "@/components/sidebar";
import { StoreProvider } from "@/lib/store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VC Scout - Intelligence Interface",
  description: "AI-powered sourcing for Venture Capital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <StoreProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar (Fixed width) */}
            <aside className="hidden md:flex flex-shrink-0">
              <Sidebar />
            </aside>

            {/* Main Content Area (Scrollable) */}
            <main className="flex-1 overflow-y-auto bg-slate-50">
              {children}
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
