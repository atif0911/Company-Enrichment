// app/api/enrich/route.ts
import { NextResponse } from "next/server";
import { EnrichmentData } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // TODO: Wire up Firecrawl/Jina + Gemini API here using process.env.SCRAPER_API_KEY
    // For now, we simulate the AI scrape delay and return structured mock data
    // so you can build the UI without burning API credits.
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const enrichedData: EnrichmentData = {
      summary: `AI-generated summary for ${url}. This company is building scalable infrastructure and demonstrating strong market fit in their sector.`,
      what_they_do: [
        "Develop core enterprise software",
        "Scale cloud infrastructure",
        "Optimize B2B workflows",
      ],
      keywords: ["B2B", "SaaS", "Enterprise", "AI", "Infrastructure"],
      derived_signals: [
        "Careers page is highly active (12 open roles)",
        "Recent product changelog updated this week",
        "SOC2 Compliance badge detected",
      ],
      sources: [url, `${url}/about`, `${url}/careers`, `${url}/changelog`],
      last_enriched: new Date().toISOString(),
    };

    return NextResponse.json(enrichedData);
  } catch (error) {
    console.error("Enrichment error:", error);
    return NextResponse.json(
      { error: "Failed to enrich company data" },
      { status: 500 },
    );
  }
}
