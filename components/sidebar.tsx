// components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ListChecks,
  Bookmark,
  Settings,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "My Lists", href: "/lists", icon: ListChecks },
  { name: "Saved Searches", href: "/saved", icon: Bookmark },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white border-r border-slate-800">
      {/* Logo Area */}
      <div className="flex h-16 items-center px-6 font-bold text-xl tracking-tight">
        <span className="text-blue-400 mr-2">✦</span> VC Scout
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col gap-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-white",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* User / Bottom Section */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">
            AS
          </div>
          <div className="text-xs">
            <p className="font-medium text-white">Atif Sardar</p>
            <p className="text-slate-500">Heritage Fund</p>
          </div>
          <Settings className="ml-auto h-4 w-4 text-slate-500 cursor-pointer hover:text-white" />
        </div>
      </div>
    </div>
  );
}
