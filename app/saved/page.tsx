// app/saved/page.tsx
"use client";

import { useStore } from "@/lib/store";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SavedSearchesPage() {
  const { savedSearches, removeSearch } = useStore();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved Searches</h1>
      <p className="text-slate-500 mb-8">
        Quickly access your frequent sourcing filters.
      </p>

      {savedSearches.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          You haven't saved any searches yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {savedSearches.map((searchQuery, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Bookmark className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    "{searchQuery}"
                  </h3>
                  <p className="text-sm text-slate-500">Saved Query</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <Link
                  href={`/companies?q=${encodeURIComponent(searchQuery)}`}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Run Search <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => removeSearch(searchQuery)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Search"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
