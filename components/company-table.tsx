// components/company-table.tsx
"use client";

import Link from "next/link";
import { Company } from "@/types";
import { Building2, Globe, MapPin, Sparkles } from "lucide-react";

interface CompanyTableProps {
  companies: Company[];
}

export function CompanyTable({ companies }: CompanyTableProps) {
  if (companies.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No companies match your filters.
      </div>
    );
  }

  return (
    <div className="w-full border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Company</th>
            <th className="px-6 py-4">Industry</th>
            <th className="px-6 py-4">Stage</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {companies.map((company) => (
            <tr
              key={company.id}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center font-bold">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      {company.name}
                      {company.isEnriched && (
                        <Sparkles className="h-3 w-3 text-amber-500" />
                      )}
                    </div>
                    <a
                      href={company.url}
                      target="_blank"
                      className="text-slate-500 text-xs flex items-center gap-1 hover:text-blue-600"
                    >
                      <Globe className="h-3 w-3" />
                      {company.url.replace("https://", "")}
                    </a>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600">
                <span className="bg-slate-100 px-2 py-1 rounded-md text-xs">
                  {company.industry}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600">{company.stage}</td>
              <td className="px-6 py-4 text-slate-600 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-slate-400" />
                {company.location}
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/companies/${company.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                  View Profile &rarr;
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
