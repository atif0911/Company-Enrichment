"use client";

import { useStore } from "@/lib/store";
import { List as ListIcon, Trash2, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ListsPage() {
  const { lists, createList, deleteList } = useStore();
  const [newListName, setNewListName] = useState("");

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      createList(newListName.trim());
      setNewListName("");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">My Company Lists</h1>
      <p className="text-slate-500 mb-8">
        Organize your companies into custom lists.
      </p>

      {/* Create New List */}
      <form onSubmit={handleCreateList} className="mb-8 flex gap-3">
        <input
            type="text"
            placeholder="Create a new list..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            type="submit"
            disabled={!newListName.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
            <Plus className="h-5 w-5" /> Create List
        </button>
      </form>

      {lists.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          You haven't created any lists yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ListIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {list.name}
                  </h3>
                  <p className="text-sm text-slate-500">{list.companyIds.length} companies</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <Link
                  href={`/lists/${list.id}`}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View List <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                      if(confirm('Are you sure you want to delete this list?')) {
                          deleteList(list.id);
                      }
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete List"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
