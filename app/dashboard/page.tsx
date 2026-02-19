"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/lib/protected-route";
import { AddBookmarkForm } from "@/components/add-bookmark-form";
import { BookmarksList } from "@/components/bookmarks-list";

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { session, signOut } = useAuth();

  const handleBookmarkAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              📑 Smart Bookmarks
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session?.user?.email}
              </span>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Bookmarks
            </h2>
            <BookmarksList refreshTrigger={refreshTrigger} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
