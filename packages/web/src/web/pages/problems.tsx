import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import { Search, Filter } from "lucide-react";
import { PROBLEMS, CATEGORIES, type Difficulty } from "../data/problems";
import { loadProgress, toggleBookmark, type ProgressStore } from "../lib/progress";
import ProblemCard from "../components/ProblemCard";

export default function ProblemsPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCategory = params.get("category") || "All";

  const [store, setStore] = useState<ProgressStore>(loadProgress());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [onlySolved, setOnlySolved] = useState(false);

  const filtered = useMemo(() => {
    return PROBLEMS.filter(p => {
      if (category !== "All" && p.category !== category) return false;
      if (difficulty !== "All" && p.difficulty !== difficulty) return false;
      if (onlyBookmarked && !store.problems[p.id]?.bookmarked) return false;
      if (onlySolved && !store.problems[p.id]?.solved) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q)) && !p.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [category, difficulty, onlyBookmarked, onlySolved, query, store]);

  const handleBookmark = (id: string) => {
    setStore(toggleBookmark(id));
  };

  const diffColors: Record<string, string> = {
    Easy: "var(--easy)",
    Medium: "var(--medium)",
    Hard: "var(--hard)",
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1
          className="text-4xl font-bold mb-1"
          style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
        >
          Problem Set
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {filtered.length} of {PROBLEMS.length} problems
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-56 flex-shrink-0">
          <div
            className="rounded-xl border p-4 sticky top-20"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            {/* Search */}
            <div className="relative mb-4">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                placeholder="Search…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border outline-none"
                style={{ borderColor: "var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                Category
              </p>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs mb-0.5 transition-colors"
                  style={{
                    background: category === cat ? "var(--accent-light)" : "transparent",
                    color: category === cat ? "var(--accent)" : "var(--text-muted)",
                    fontWeight: category === cat ? 600 : 400,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                Difficulty
              </p>
              {(["All", "Easy", "Medium", "Hard"] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs mb-0.5 transition-colors"
                  style={{
                    background: difficulty === d ? (d === "All" ? "var(--accent-light)" : `${diffColors[d]}18`) : "transparent",
                    color: difficulty === d ? (d === "All" ? "var(--accent)" : diffColors[d]) : "var(--text-muted)",
                    fontWeight: difficulty === d ? 600 : 400,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              {[
                { label: "Bookmarked only", value: onlyBookmarked, set: setOnlyBookmarked },
                { label: "Solved only", value: onlySolved, set: setOnlySolved },
              ].map(({ label, value, set }) => (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <div
                    className="w-8 h-4 rounded-full relative transition-colors flex-shrink-0"
                    style={{ background: value ? "var(--accent)" : "var(--border)" }}
                    onClick={() => set(!value)}
                  >
                    <div
                      className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all"
                      style={{ left: value ? "calc(100% - 14px)" : "2px" }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Problem Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
              <Filter size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No problems match your filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((problem, i) => (
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
      </div>
    </div>
  );
}
