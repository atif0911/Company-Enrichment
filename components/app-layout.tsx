"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Menu, X } from "lucide-react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
            <div className="md:hidden absolute top-4 right-4 z-[60]">
                 <button onClick={() => setSidebarOpen(false)} className="text-white bg-slate-800 p-1 rounded-md">
                    <X size={20}/>
                 </button>
            </div>
            <Sidebar />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header with Hamburger */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open sidebar</span>
                </button>
                <span className="font-bold text-xl tracking-tight text-slate-900">
                    <span className="text-blue-600 mr-2">✦</span> VC Scout
                </span>
            </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 text-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
