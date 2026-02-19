"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const [data, setData] = useState<UserData>(defaultState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from API when session exists
  useEffect(() => {
    if (session?.user) {
      const fetchData = async () => {
        try {
          const [listsRes, searchesRes] = await Promise.all([
             fetch("/api/user/lists"),
             fetch("/api/user/searches")
          ]);
          
          if (listsRes.ok && searchesRes.ok) {
              const lists = await listsRes.json();
              const searches = await searchesRes.json();
              
              // Normalize lists for store
              const formattedLists = lists.map((l: any) => ({
                  id: l._id,
                  name: l.name,
                  companyIds: l.companyIds || []
              }));
              
              const formattedSearches = searches.map((s: any) => s.query);

              setData(prev => ({
                  ...prev,
                  lists: formattedLists,
                  savedSearches: formattedSearches
              }));
          }
        } catch (e) {
            console.error("Failed to fetch user data", e);
        }
        setIsInitialized(true);
      };
      fetchData();
    } else {
        // Reset or use local storage for guest? For now reset.
        setData(defaultState);
        setIsInitialized(true);
    }
  }, [session]);

  const createList = async (name: string) => {
    // Optimistic update
    const tempId = crypto.randomUUID();
    const newList: List = { id: tempId, name, companyIds: [] };
    setData((prev) => ({ ...prev, lists: [...prev.lists, newList] }));

    if (session?.user) {
        try {
            const res = await fetch("/api/user/lists", {
                method: "POST",
                body: JSON.stringify({ name }),
            });
            if (res.ok) {
                const created = await res.json();
                // Update ID from temp to real
                setData(prev => ({
                    ...prev,
                    lists: prev.lists.map(l => l.id === tempId ? { ...l, id: created._id } : l)
                }));
            }
        } catch (e) { console.error("API Error", e); }
    }
  };

  const deleteList = async (id: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.filter((l) => l.id !== id),
    }));

    if (session?.user) {
         await fetch(`/api/user/lists?id=${id}`, { method: "DELETE" });
    }
  };

  const addCompanyToList = async (listId: string, companyId: string) => {
    let updatedList: List | undefined;
    
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => {
        if (list.id === listId && !list.companyIds.includes(companyId)) {
          updatedList = { ...list, companyIds: [...list.companyIds, companyId] };
          return updatedList;
        }
        return list;
      }),
    }));

    if (session?.user && updatedList) {
        await fetch("/api/user/lists", {
            method: "PUT",
            body: JSON.stringify({ id: listId, companyIds: updatedList.companyIds })
        });
    }
  };

  const removeCompanyFromList = async (listId: string, companyId: string) => {
    let updatedList: List | undefined;
    
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => {
        if (list.id === listId) {
           updatedList = {
            ...list,
            companyIds: list.companyIds.filter((id) => id !== companyId),
          };
          return updatedList;
        }
        return list;
      }),
    }));

     if (session?.user && updatedList) {
        await fetch("/api/user/lists", {
            method: "PUT",
            body: JSON.stringify({ id: listId, companyIds: updatedList.companyIds })
        });
    }
  };

  const updateNote = (companyId: string, content: string) => {
    // TODO: Implement Note API
    setData((prev) => ({
      ...prev,
      notes: { ...prev.notes, [companyId]: content },
    }));
  };

  const saveSearch = async (query: string) => {
    if (!data.savedSearches.includes(query)) {
      setData((prev) => ({
        ...prev,
        savedSearches: [query, ...prev.savedSearches],
      }));
      
      if (session?.user) {
          await fetch("/api/user/searches", {
              method: "POST",
              body: JSON.stringify({ query })
          });
      }
    }
  };

  const removeSearch = async (query: string) => {
    setData((prev) => ({
      ...prev,
      savedSearches: prev.savedSearches.filter((s) => s !== query),
    }));
    
    if (session?.user) {
         await fetch(`/api/user/searches?query=${encodeURIComponent(query)}`, { method: "DELETE" });
    }
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