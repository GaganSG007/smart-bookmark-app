"use client";

import { useEffect, useState } from "react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/lib/auth-context";
import { RealtimeChannel } from "@supabase/supabase-js";
import { onTabMessage, postTabMessage, onTabStorage } from "@/lib/tab-sync";

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
  const [undoInfo, setUndoInfo] = useState<{
    bookmark: Bookmark;
    timerId: number | null;
  } | null>(null);
  const undoTimerRef = useRef<number | null>(null);
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

    const offStorage = onTabStorage((msg) => {
      if (!msg) return;
      if (msg.type === "bookmark_added") {
        const bm = msg.bookmark as Bookmark;
  const handleDelete = async (bookmark: Bookmark) => {
          if (prev.find((p) => p.id === bm.id)) return prev;
      setDeleteLoading(bookmark.id);
      // clear any existing undo timer for a previous deletion
      if (undoTimerRef.current) {
        window.clearTimeout(undoTimerRef.current);
        undoTimerRef.current = null;
        setUndoInfo(null);
      }
        });
      } else if (msg.type === "bookmark_deleted") {
        const id = msg.id as string;
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        .eq("id", bookmark.id)
    });
    return off;
    return () => {
      off();
      offStorage();
    };
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id));

  const handleDelete = async (bookmarkId: string) => {
          postTabMessage({ type: "bookmark_deleted", id: bookmark.id });
          postTabMessage; // noop to keep linter quiet in some environments
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

  const handleUndo = async () => {
    if (!undoInfo) return;
    const bm = undoInfo.bookmark;
    try {
      // Re-insert the bookmark with same id
      const { error: insertError } = await supabase.from("bookmarks").insert([
        {
          id: bm.id,
          user_id: bm.user_id,
          title: bm.title,
          url: bm.url,
          created_at: bm.created_at,
        },
      ]);

      if (!insertError) {
        setBookmarks((prev) => [bm, ...prev]);
        postTabMessage({ type: "bookmark_added", bookmark: bm });
        // clear undo state
        if (undoInfo.timerId) window.clearTimeout(undoInfo.timerId);
        undoTimerRef.current = null;
        setUndoInfo(null);
      } else {
        setError(insertError.message);
      }
    } catch (err) {
      console.error("Undo insert failed:", err);
      setError("Failed to undo delete");
    }
  };
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
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition transform-gpu motion-reduce:transition-none duration-150 ease-out hover:-translate-y-1 flex items-start justify-between group"
        >
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* favicon */}
            <div className="w-10 h-10 flex-shrink-0">
              {(() => {
                try {
                  const u = new URL(bookmark.url);
                  const host = u.hostname;
                  const fav = `https://icons.duckduckgo.com/ip3/${host}.ico`;
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fav}
                      alt={host}
                      className="w-10 h-10 rounded border"
                    />
                  );
                } catch (e) {
                  return (
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                      🔗
                    </div>
                  );
                }
              })()}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-lg break-words truncate">
                {bookmark.title}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm truncate"
                  title={bookmark.url}
                >
                  {bookmark.url}
                </a>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-gray-500 text-xs">
                  {new Date(bookmark.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* excerpt derived from path */}
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {(() => {
                  try {
                    const u = new URL(bookmark.url);
                    const path = decodeURIComponent(u.pathname + u.search).replace(/\//g, ' ');
                    return path && path !== ' ' ? path.slice(0, 140) : u.hostname;
                  } catch (e) {
      {undoInfo && (
        <Snackbar
          message="Bookmark deleted"
          actionLabel="Undo"
          onAction={handleUndo}
          onClose={() => {
            if (undoInfo.timerId) window.clearTimeout(undoInfo.timerId);
            undoTimerRef.current = null;
            setUndoInfo(null);
          }}
        />
      )}
                    return '';
                  }
                })()}
              </p>
            </div>
          </div>

          <div className="flex gap-2 ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Open
            </a>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(bookmark.url);
              }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Copy
            </button>
            <button
              onClick={() => handleDelete(bookmark.id)}
              disabled={deleteLoading === bookmark.id}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteLoading === bookmark.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
