import { Link } from "wouter";
import { Bookmark, BookmarkCheck, CheckCircle, ChevronRight } from "lucide-react";
import type { Problem } from "../data/problems";
import type { ProblemProgress } from "../lib/progress";

type Props = {
  problem: Problem;
  progress?: ProblemProgress;
  onBookmark?: (id: string) => void;
  index: number;
};

const difficultyColors: Record<string, string> = {
  Easy: "var(--easy)",
  Medium: "var(--medium)",
  Hard: "var(--hard)",
};

export default function ProblemCard({ problem, progress, onBookmark, index }: Props) {
  return (
    <div
      className="group relative rounded-xl border transition-all duration-200 hover:shadow-md"
      style={{
        background: "var(--surface)",
        borderColor: progress?.solved ? "var(--accent)" : "var(--border)",
        borderWidth: progress?.solved ? "1.5px" : "1px",
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* Solved indicator */}
      {progress?.solved && (
        <div
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "var(--accent)" }}
        >
          <CheckCircle size={12} className="text-white" />
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: `${difficultyColors[problem.difficulty]}18`,
                  color: difficultyColors[problem.difficulty],
                }}
              >
                {problem.difficulty}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
              >
                {problem.category}
              </span>
            </div>
            <h3
              className="font-semibold text-sm leading-snug group-hover:text-[var(--accent)] transition-colors"
              style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
            >
              {problem.title}
            </h3>
          </div>

          {onBookmark && (
            <button
              className="p-1 rounded-md transition-colors flex-shrink-0 mt-0.5"
              style={{ color: progress?.bookmarked ? "var(--accent)" : "var(--border)" }}
              onClick={e => {
                e.preventDefault();
                onBookmark(problem.id);
              }}
              title={progress?.bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              {progress?.bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          )}
        </div>

        {/* Statement preview */}
        <p
          className="text-xs leading-relaxed line-clamp-2 mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          {problem.statement.replace(/\\[a-z]+\{[^}]*\}|\\[a-z]+|\$[^$]*\$/g, "").slice(0, 120)}…
        </p>

        {/* Company tags */}
        {problem.companies && problem.companies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {problem.companies.slice(0, 3).map(c => (
              <span
                key={c}
                className="text-xs px-1.5 py-0.5 rounded-md font-medium"
                style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {problem.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ background: "var(--tag-bg)", color: "var(--tag-text)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {problem.source && (
            <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
              {problem.source}
            </span>
          )}
          <Link to={`/problems/${problem.id}`}>
            <span
              className="flex items-center gap-1 text-xs font-medium cursor-pointer ml-auto"
              style={{ color: "var(--accent)" }}
            >
              Solve <ChevronRight size={13} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
