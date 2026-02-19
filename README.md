# VC Scout - Company Enrichment Platform

A powerful intelligence interface for Venture Capitalists to source, track, and enrich company data using AI.

## Features

-   **Company Discovery**: Browse and filter companies by stage, industry, and name.
-   **Live Enrichment**: Real-time website scraping and AI analysis using **Firecrawl** and **Gemini 2.0 Flash**.
    -   Extracts summary, "what they do", keywords, and derived signals (e.g., "Hiring aggressively").
-   **List Management**:
    -   Create custom lists (e.g., "Watchlist", "High Priority").
    -   Add companies to lists directly from their profile.
    -   Export lists to JSON.
-   **Saved Searches**: Save complex search queries for quick access.
-   **Data Persistence**: All data (lists, notes, enriched data) is persisted locally, so you never lose your work.

## specific Tech Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Styling**: Tailwind CSS
-   **State Management**: React Context + LocalStorage
-   **AI & Scraping**:
    -   [Firecrawl](https://firecrawl.dev) for turning websites into Markdown.
    -   [Google Gemini](https://ai.google.dev) for structured data extraction.

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd company-enrichment
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory and add your API keys:
    ```env
    FIRECRAWL_API_KEY=fc_...
    GEMINI_API_KEY=...
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

-   `app/`: Next.js App Router pages and API routes.
    -   `api/enrich/`: Serverless function for AI enrichment.
    -   `companies/`: Main discovery and profile pages.
    -   `lists/`: List management views.
-   `components/`: Reusable UI components (Sidebar, CompanyTable).
-   `lib/`: customizable utilities and global store (`store.tsx`).

## Usage Tips

-   **Enrichment**: Go to a company profile and click "Live Enrich". Requires valid API keys.
-   **Mock Data**: If API keys are missing, the app seamlessly falls back to mock data for demonstration purposes.
