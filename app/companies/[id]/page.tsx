// app/companies/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import { EnrichmentData } from "@/types";
import { useStore } from "@/lib/store";
import {
  Building2,
  Globe,
  Sparkles,
  Loader2,
  ArrowLeft,
  BookmarkPlus,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function CompanyProfile() {
  const params = useParams();
  const { lists, addCompanyToList, notes, updateNote } = useStore();

  const [company, setCompany] = useState(
    MOCK_COMPANIES.find((c) => c.id === params.id),
  );

  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(
    null,
  );
  const [noteInput, setNoteInput] = useState(notes[params.id as string] || "");

  // Handle the Live Enrichment API Call
  const handleEnrichment = async () => {
    if (!company) return;
    setIsEnriching(true);

    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: company.url }),
      });

      if (!response.ok) throw new Error("Failed to enrich");

      const data = await response.json();
      setEnrichmentData(data);

      // Update local state to show it's enriched
      setCompany({ ...company, isEnriched: true });
    } catch (error) {
      console.error(error);
      alert("Enrichment failed. Please try again.");
    } finally {
      setIsEnriching(false);
    }
  };

  const handleSaveNote = () => {
    updateNote(params.id as string, noteInput);
    alert("Note saved!");
  };

  if (!company) return <div className="p-8">Company not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link
        href="/companies"
        className="text-sm text-slate-500 flex items-center gap-2 mb-6 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Search
      </Link>

      {/* Header Profile */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 flex justify-between items-start">
        <div className="flex gap-6 items-center">
          <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-2xl">
            {company.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {company.name}
            </h1>
            <a
              href={company.url}
              target="_blank"
              className="text-blue-600 flex items-center gap-2 mt-1 hover:underline"
            >
              <Globe className="h-4 w-4" /> {company.url}
            </a>
            <div className="flex gap-3 mt-3">
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                {company.industry}
              </span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                {company.stage}
              </span>
            </div>
          </div>
        </div>

        {/* The Action Button */}
        <button
          onClick={handleEnrichment}
          disabled={isEnriching || !!enrichmentData}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 transition-all"
        >
          {isEnriching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 text-amber-400" />
          )}
          {enrichmentData ? "Enriched" : "Live Enrich"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="col-span-2 space-y-6">
          {/* Default Info */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-3">Overview</h2>
            <p className="text-slate-600">{company.description}</p>
          </div>

          {/* Enriched Data Display */}
          {enrichmentData && (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-blue-900">
                  AI Intelligence Report
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-1">
                    Summary
                  </h3>
                  <p className="text-slate-700 text-sm">
                    {enrichmentData.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-2">
                      What They Do
                    </h3>
                    <ul className="space-y-1">
                      {enrichmentData.what_they_do.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-700 flex items-start gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-2">
                      Derived Signals
                    </h3>
                    <ul className="space-y-1">
                      {enrichmentData.derived_signals.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-700 flex items-start gap-2"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-2">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {enrichmentData.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <BookmarkPlus className="h-4 w-4" /> Save to List
            </h3>
            <select
              className="w-full border border-slate-200 rounded-lg p-2 mb-3 text-sm"
              onChange={(e) => {
                if (e.target.value) {
                  addCompanyToList(e.target.value, company.id);
                  alert("Added to list!");
                }
              }}
            >
              <option value="">Select a list...</option>
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-3">Thesis Notes</h3>
            <textarea
              className="w-full border border-slate-200 rounded-lg p-3 text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Why does this match our thesis?"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <button
              onClick={handleSaveNote}
              className="w-full mt-3 bg-slate-100 hover:bg-slate-200 text-slate-900 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
