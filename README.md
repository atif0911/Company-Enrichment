# VC Scout - Company Enrichment Platform

A powerful intelligence interface for Venture Capitalists to source, track, and enrich company data using AI.

## Features

-   **Company Discovery**: Browse and filter companies by stage, industry, and name.
-   **Live Enrichment**: Real-time website scraping and AI analysis using **Firecrawl** and **Gemini 2.0 Flash**.
    -   Extracts summary, "what they do", keywords, and derived signals (e.g., "Hiring aggressively").
-   **Authentication**: Secure user accounts using **NextAuth.js** (Email/Password).
-   **User-Scoped Data**:
    -   Create custom lists (e.g., "Watchlist", "High Priority").
    -   Save complex search queries for quick access.
    -   All data is stored securely in **MongoDB** and linked to your user account.
-   **Responsive Design**: optimized for desktop and tablet usage.

## Tech Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Database**: MongoDB (via Mongoose ODM)
-   **Authentication**: NextAuth.js v5
-   **Styling**: Tailwind CSS
-   **AI & Scraping**:
    -   [Firecrawl](https://firecrawl.dev) for turning websites into Markdown.
    -   [Google Gemini](https://ai.google.dev) for structured data extraction.

## Getting Started

### Prerequisites

-   Node.js 18+ installed.
-   A MongoDB Atlas account (or local MongoDB instance).
-   API keys for Firecrawl and Google Gemini.

### Installation

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
    Create a `.env` file in the root directory and add the following keys:

    ```env
    # Database
    DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/company-enrichment"

    # Authentication (Generate a random string: openssl rand -base64 32)
    AUTH_SECRET="your-secret-key"

    # AI & Scraping
    FIRECRAWL_API_KEY="fc_..."
    GEMINI_API_KEY="AIza..."
    ```

    > **Note:** Ensure your IP address is whitelisted in MongoDB Atlas Network Access.

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000).

### Usage

1.  **Sign Up**: Create a new account at `/register`.
2.  **Explore**: Use the dashboard to find companies.
3.  **Enrich**: Go to a company profile and click "Live Enrich".
4.  **Save**: Add companies to your lists or save search queries.

## Deployment

This application is ready to be deployed on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add the Environment Variables in the Vercel dashboard.
4.  Deploy!

## Project Structure

-   `app/`: Next.js App Router pages and API routes.
    -   `api/`: Backend API routes (Auth, Enrichment, User Data).
-   `components/`: Reusable UI components.
-   `lib/`: Utilities, Database Connection (`db.ts`), and Mongoose Models (`models.ts`).
-   `auth.ts` / `auth.config.ts`: NextAuth configuration.
