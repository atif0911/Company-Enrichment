// app/companies/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import { CompanyTable } from "@/components/company-table";
import { Search, Filter } from "lucide-react";
import { useStore } from "@/lib/store";

import { Suspense } from "react";

function CompaniesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [stageFilter, setStageFilter] = useState("All");
  const { saveSearch } = useStore();

  // Update search query if URL param changes
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);


  // Basic filtering logic
  const filteredCompanies = MOCK_COMPANIES.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "All" || company.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  // Pagination
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, stageFilter]);

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Discovery</h1>
          <p className="text-slate-500 mt-1">
            Search and filter your deal flow.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => {
              if (searchQuery.trim()) {
                saveSearch(searchQuery.trim());
                alert("Search saved!");
              }
            }}
            disabled={!searchQuery.trim()}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Save Search
          </button>
        </div>

        <div className="relative">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="appearance-none pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Stages</option>
            <option value="Pre-Seed">Pre-Seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
            <option value="Growth">Growth</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Results Table */}
      <CompanyTable companies={paginatedCompanies} />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredCompanies.length)}
            </span>{" "}
            of <span className="font-medium">{filteredCompanies.length}</span> results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CompaniesContent />
    </Suspense>
  );
}
