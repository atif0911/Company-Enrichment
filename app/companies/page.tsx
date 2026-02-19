import { Suspense } from "react";
import { CompaniesClient } from "./companies-client";

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CompaniesClient />
    </Suspense>
  );
}
