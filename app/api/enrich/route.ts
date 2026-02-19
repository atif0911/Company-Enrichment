import { NextResponse } from "next/server";
import { EnrichmentData } from "@/types";
import FirecrawlApp from "@mendable/firecrawl-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 1. Initialize Clients
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    console.log("Enrichment Request for:", url);
    console.log("Firecrawl Key Present:", !!firecrawlApiKey);
    console.log("Gemini Key Present:", !!geminiApiKey);

    if (!firecrawlApiKey || !geminiApiKey) {
      // Fallback to mock data if keys are missing (for dev safety)
      console.warn("Missing API keys, falling back to mock delay + data");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json({
        summary: `[MOCK] AI-generated summary for ${url}. Configure API keys for real data.`,
        what_they_do: ["Mock Item 1", "Mock Item 2"],
        keywords: ["Mock", "Data", "Only"],
        derived_signals: ["API Keys Missing", "Check .env.local"],
        sources: [url],
        last_enriched: new Date().toISOString(),
      });
    }

    const firecrawl = new FirecrawlApp({ apiKey: firecrawlApiKey });
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. Scrape Website using Firecrawl
    const scrapeResult = await firecrawl.scrape(url, {
      formats: ["markdown"],
    });

    if (!scrapeResult || !scrapeResult.markdown) {
      throw new Error(`Firecrawl failed to return content`);
    }

    const websiteContent = scrapeResult.markdown.slice(0, 20000); // Limit context window if needed

    // 3. Analyze with Gemini
    const prompt = `
      You are a Venture Capital analyst. Analyze the following website content for a company at ${url}.
      
      Website Content:
      """
      ${websiteContent}
      """

      Extract structured data in valid JSON format with the following schema:
      {
        "summary": "2-3 sentences describing the company, its market, and value prop logic.",
        "what_they_do": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
        "keywords": ["tag1", "tag2", "tag3", "tag4", "tag5"],
        "derived_signals": ["Signal 1 (e.g. Hiring aggressively)", "Signal 2 (e.g. SOC2 Compliant)", "Signal 3"]
      }
      
      Output ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown code blocks in response
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const structuredData = JSON.parse(jsonString);

    const enrichedData: EnrichmentData = {
      ...structuredData,
      sources: [url],
      last_enriched: new Date().toISOString(),
    };

    return NextResponse.json(enrichedData);
  } catch (error: any) {
    console.error("Enrichment error details:", error);
    
    // Handle Google Generative AI Rate Limits specifically
    if (error.message?.includes("429") || error.status === 429) {
      return NextResponse.json(
        { 
          error: "AI Rate Limit Exceeded. Please try again in a minute.", 
          isQuotaError: true 
        },
        { status: 429 } // Return 429 to client so it can handle it
      );
    }

    // Return the actual error message to the client for debugging
    return NextResponse.json(
      { error: `Failed to enrich: ${error.message || error}` },
      { status: 500 },
    );
  }
}
