"use client";

import { useStore } from "@/lib/store";
import { CompanyTable } from "@/components/company-table";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ListDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { lists, deleteList, removeCompanyFromList } = useStore();

  const list = lists.find((l) => l.id === params.id);

  if (!list) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">List not found</h2>
        <Link href="/lists" className="text-blue-600 hover:text-blue-800">
          Back to Lists
        </Link>
      </div>
    );
  }

  // filter companies
  // In a real app, you might fetch these by ID.
  const listCompanies = MOCK_COMPANIES.filter((c) =>
    list.companyIds.includes(c.id)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Link
        href="/lists"
        className="text-sm text-slate-500 flex items-center gap-2 mb-6 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Lists
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{list.name}</h1>
          <p className="text-slate-500 mt-1">
            {listCompanies.length} companies in this list.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete this list?")) {
              deleteList(list.id);
              router.push("/lists");
            }
          }}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" /> Delete List
        </button>
      </div>

      <CompanyTable companies={listCompanies} />
    </div>
  );
}
