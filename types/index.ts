// types/index.ts

export interface EnrichmentData {
  summary: string;
  what_they_do: string[]; // Bullet points
  keywords: string[];
  derived_signals: string[]; // e.g., "Hiring", "Product Launch"
  sources: string[]; // URLs scraped
  last_enriched: string; // ISO Date string
}

export interface Company {
  id: string;
  name: string;
  url: string; // The domain we will scrape
  description: string; // Short pitch
  industry: string;
  location: string;
  foundedYear: number;
  stage: "Pre-Seed" |"Seed" | "Series A" | "Series B" | "Growth";
  // Enriched State
  isEnriched: boolean;
  enrichment?: EnrichmentData;
  // User Actions
  notes?: string;
  isSaved?: boolean;
}
