// app/lists/page.tsx
"use client";

import { useStore } from "@/lib/store";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import { Trash2, Download, Building2 } from "lucide-react";
import Link from "next/link";

export default function ListsPage() {
  const { lists, deleteList, removeCompanyFromList } = useStore();

  // Helper to export a list as JSON
  const handleExportJSON = (listName: string, companyIds: string[]) => {
    const listCompanies = MOCK_COMPANIES.filter((c) =>
      companyIds.includes(c.id),
    );
    const dataStr = JSON.stringify(listCompanies, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${listName.replace(/\s+/g, "-").toLowerCase()}-export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">My Lists</h1>
      <p className="text-slate-500 mb-8">
        Manage and export your curated company lists.
      </p>

      {lists.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          You haven't created any lists yet. Save companies from their profiles!
        </div>
      ) : (
        <div className="space-y-8">
          {lists.map((list) => {
            const listCompanies = MOCK_COMPANIES.filter((c) =>
              list.companyIds.includes(c.id),
            );

            return (
              <div
                key={list.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    {list.name}{" "}
                    <span className="text-slate-400 text-sm font-normal">
                      ({list.companyIds.length})
                    </span>
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleExportJSON(list.name, list.companyIds)
                      }
                      className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      <Download className="h-4 w-4" /> Export JSON
                    </button>
                    <button
                      onClick={() => deleteList(list.id)}
                      className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-md transition-colors"
                      title="Delete List"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {listCompanies.length === 0 ? (
                    <p className="text-sm text-slate-500 italic py-2">
                      No companies in this list.
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {listCompanies.map((company) => (
                        <li
                          key={company.id}
                          className="py-3 flex justify-between items-center group"
                        >
                          <div>
                            <Link
                              href={`/companies/${company.id}`}
                              className="font-medium text-slate-900 hover:text-blue-600 transition-colors"
                            >
                              {company.name}
                            </Link>
                            <p className="text-xs text-slate-500">
                              {company.industry} • {company.stage}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              removeCompanyFromList(list.id, company.id)
                            }
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-sm flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
