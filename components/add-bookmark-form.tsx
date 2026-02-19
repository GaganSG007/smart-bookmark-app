"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/lib/auth-context";
import { postTabMessage, postTabStorage } from "@/lib/tab-sync";

interface AddBookmarkFormProps {
  onBookmarkAdded: () => void;
}

export function AddBookmarkForm({ onBookmarkAdded }: AddBookmarkFormProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim() || !title.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!session) {
      setError("You must be logged in to add bookmarks");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Validate URL
      try {
        new URL(url);
      } catch {
        setError("Please enter a valid URL");
        return;
      }

      const { data: insertedData, error: insertError } = await supabase
        .from("bookmarks")
        .insert([
          {
            user_id: session.user.id,
            url: url.trim(),
            title: title.trim(),
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (insertError) {
        setError(insertError.message);
      } else {
        const newBookmark = insertedData?.[0] || null;
        setUrl("");
        setTitle("");
        onBookmarkAdded();
        // Broadcast to other tabs so they update immediately
        if (newBookmark) {
          postTabMessage({ type: "bookmark_added", bookmark: newBookmark });
          postTabStorage({ type: "bookmark_added", bookmark: newBookmark });
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Add New Bookmark
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bookmark title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Bookmark"}
        </button>
      </div>
    </form>
  );
}
