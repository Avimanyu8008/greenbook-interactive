import { useState } from "react";
import { BookmarkX } from "lucide-react";
import { PROBLEMS } from "../data/problems";
import { loadProgress, toggleBookmark, type ProgressStore } from "../lib/progress";
import ProblemCard from "../components/ProblemCard";

export default function BookmarksPage() {
  const [store, setStore] = useState<ProgressStore>(loadProgress());

  const bookmarked = PROBLEMS.filter(p => store.problems[p.id]?.bookmarked);

  const handleBookmark = (id: string) => {
    setStore(toggleBookmark(id));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1
        className="text-4xl font-bold mb-1"
        style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
      >
        Bookmarks
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        {bookmarked.length} bookmarked problem{bookmarked.length !== 1 ? "s" : ""}
      </p>

      {bookmarked.length === 0 ? (
        <div
          className="text-center py-20 rounded-xl border"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <BookmarkX size={40} className="mx-auto mb-3 opacity-20" style={{ color: "var(--accent)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No bookmarks yet. Click the bookmark icon on any problem to save it here.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarked.map((problem, i) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              progress={store.problems[problem.id]}
              onBookmark={handleBookmark}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
