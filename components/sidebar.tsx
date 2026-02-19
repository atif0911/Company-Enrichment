// components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Building2,
  ListChecks,
  Bookmark,
  Settings,
  Search,
  LogOut,
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
  const { data: session } = useSession();

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
        {session?.user ? (
            <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs overflow-hidden">
                {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name || "User"} className="h-full w-full object-cover" />
                ) : (
                    session.user.name?.charAt(0) || "U"
                )}
            </div>
            <div className="text-xs flex-1 overflow-hidden">
                <p className="font-medium text-white truncate">{session.user.name}</p>
                <p className="text-slate-500 truncate">{session.user.email}</p>
            </div>
            <button 
                onClick={() => signOut()}
                className="ml-auto text-slate-500 hover:text-white"
                title="Sign Out"
            >
                <LogOut className="h-4 w-4" />
            </button>
            </div>
        ) : (
             <div className="flex flex-col gap-2">
                <Link 
                    href="/login"
                    className="flex w-full justify-center rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold leading-6 text-white shadow-sm hover:bg-slate-700"
                >
                    Sign In
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}
