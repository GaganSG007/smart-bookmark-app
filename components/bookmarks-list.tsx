"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/lib/auth-context";
import { RealtimeChannel } from "@supabase/supabase-js";
import { onTabMessage, postTabMessage } from "@/lib/tab-sync";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  created_at: string;
  user_id: string;
}

interface BookmarksListProps {
  refreshTrigger: number;
}

export function BookmarksList({ refreshTrigger }: BookmarksListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { session } = useAuth();

  const fetchBookmarks = async () => {
    if (!session) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setBookmarks(data || []);
      }
    } catch (err) {
      setError("Failed to load bookmarks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [session, refreshTrigger]);

  useEffect(() => {
    if (!session) return;

    let channel: RealtimeChannel;

    try {
      // Subscribe to real-time changes
      channel = supabase
        .channel(`bookmarks:user_id=eq.${session.user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            // Debug realtime payloads
            console.debug("realtime payload:", payload);
            if (payload.eventType === "INSERT") {
              setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
            } else if (payload.eventType === "DELETE") {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.error("Real-time subscription error:", err);
    }

    return () => {
      channel?.unsubscribe();
    };
  }, [session]);

  // Listen for cross-tab messages so background tabs update immediately
  useEffect(() => {
    const off = onTabMessage((msg) => {
      if (!msg) return;
      if (msg.type === "bookmark_added") {
        const bm = msg.bookmark as Bookmark;
        setBookmarks((prev) => {
          // avoid duplicates
          if (prev.find((p) => p.id === bm.id)) return prev;
          return [bm, ...prev];
        });
      } else if (msg.type === "bookmark_deleted") {
        const id = msg.id as string;
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
      }
    });
    return off;
  }, []);

  const handleDelete = async (bookmarkId: string) => {
    try {
      setDeleteLoading(bookmarkId);

      const { error: deleteError } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmarkId)
        .eq("user_id", session?.user.id);

      if (deleteError) {
        setError(deleteError.message);
      } else {
        // Optimistic UI update: remove the bookmark immediately
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
        // Broadcast deletion to other tabs so they can update immediately
        try {
          postTabMessage({ type: "bookmark_deleted", id: bookmarkId });
        } catch (err) {
          // ignore
        }
      }
    } catch (err) {
      setError("Failed to delete bookmark");
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin text-3xl mb-2">⏳</div>
        <p className="text-gray-600">Loading bookmarks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl mb-2">📚</p>
        <p className="text-gray-600">No bookmarks yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex items-start justify-between"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 text-lg break-words">
              {bookmark.title}
            </h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all text-sm truncate inline-block max-w-full"
              title={bookmark.url}
            >
              {bookmark.url}
            </a>
            <p className="text-gray-500 text-xs mt-1">
              {new Date(bookmark.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => handleDelete(bookmark.id)}
              disabled={deleteLoading === bookmark.id}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteLoading === bookmark.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
