"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Company, EnrichmentData } from "@/types";

// 1. Define the Shape of our Store
interface List {
  id: string;
  name: string;
  companyIds: string[]; // We store IDs, not full objects, to keep it light
}

interface UserData {
  lists: List[];
  notes: Record<string, string>; // Map companyId -> note content
  savedSearches: string[];
  enrichedData: Record<string, EnrichmentData>; // Map companyId -> enriched data
}

interface StoreContextType extends UserData {
  // Actions
  createList: (name: string) => void;
  deleteList: (id: string) => void;
  addCompanyToList: (listId: string, companyId: string) => void;
  removeCompanyFromList: (listId: string, companyId: string) => void;
  updateNote: (companyId: string, content: string) => void;
  saveSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  cacheEnrichmentData: (companyId: string, data: EnrichmentData) => void;
}

// 2. Default Initial State
const defaultState: UserData = {
  lists: [
    { id: "default-1", name: "My Watchlist", companyIds: [] },
    { id: "default-2", name: "High Priority", companyIds: [] },
  ],

  notes: {},
  savedSearches: [],
  enrichedData: {},
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// 3. The Provider Component
export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with defaults, but we will overwrite with localStorage in useEffect
  const [data, setData] = useState<UserData>(defaultState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from LocalStorage on mount (Client-side only)
  useEffect(() => {
    const stored = localStorage.getItem("vc-scout-store");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("vc-scout-store", JSON.stringify(data));
    }
  }, [data, isInitialized]);

  // --- Actions ---

  const createList = (name: string) => {
    const newList: List = {
      id: crypto.randomUUID(), // Native browser UUID generation
      name,
      companyIds: [],
    };
    setData((prev) => ({ ...prev, lists: [...prev.lists, newList] }));
  };

  const deleteList = (id: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.filter((l) => l.id !== id),
    }));
  };

  const addCompanyToList = (listId: string, companyId: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => {
        if (list.id === listId && !list.companyIds.includes(companyId)) {
          return { ...list, companyIds: [...list.companyIds, companyId] };
        }
        return list;
      }),
    }));
  };

  const removeCompanyFromList = (listId: string, companyId: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            companyIds: list.companyIds.filter((id) => id !== companyId),
          };
        }
        return list;
      }),
    }));
  };

  const updateNote = (companyId: string, content: string) => {
    setData((prev) => ({
      ...prev,
      notes: { ...prev.notes, [companyId]: content },
    }));
  };

  const saveSearch = (query: string) => {
    if (!data.savedSearches.includes(query)) {
      setData((prev) => ({
        ...prev,
        savedSearches: [query, ...prev.savedSearches],
      }));
    }
  };

  const removeSearch = (query: string) => {
    setData((prev) => ({
      ...prev,
      savedSearches: prev.savedSearches.filter((s) => s !== query),
    }));
  };

  const cacheEnrichmentData = (companyId: string, enrichmentData: EnrichmentData) => {
    setData((prev) => ({
      ...prev,
      enrichedData: { ...prev.enrichedData, [companyId]: enrichmentData },
    }));
  };

  return (
    <StoreContext.Provider
      value={{
        ...data,
        createList,
        deleteList,
        addCompanyToList,
        removeCompanyFromList,
        updateNote,
        saveSearch,
        removeSearch,
        cacheEnrichmentData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// 4. The Custom Hook for easy access
export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}