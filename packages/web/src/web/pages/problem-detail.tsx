import { useState } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ChevronDown, ChevronUp, Bookmark, BookmarkCheck, CheckCircle, Lightbulb, BookOpen, StickyNote } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import { PROBLEMS } from "../data/problems";
import { loadProgress, markSolved, toggleBookmark, saveNotes, type ProgressStore } from "../lib/progress";
import SimulationPanel from "../components/SimulationPanel";

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const problem = PROBLEMS.find(p => p.id === id);

  const [store, setStore] = useState<ProgressStore>(loadProgress());
  const [hintsOpen, setHintsOpen] = useState<number[]>([]);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState(store.problems[id ?? ""]?.notes || "");

  if (!problem) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p style={{ color: "var(--text-muted)" }}>Problem not found.</p>
        <Link to="/problems">
          <span className="text-sm mt-2 block cursor-pointer" style={{ color: "var(--accent)" }}>
            ← Back to Problems
          </span>
        </Link>
      </div>
    );
  }

  const progress = store.problems[problem.id];
  const diffColors: Record<string, string> = {
    Easy: "var(--easy)", Medium: "var(--medium)", Hard: "var(--hard)",
  };

  const toggleHint = (i: number) => {
    setHintsOpen(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const handleSolved = () => {
    setStore(markSolved(problem.id));
    setSolutionOpen(true);
  };

  const handleBookmark = () => setStore(toggleBookmark(problem.id));

  const handleSaveNotes = () => {
    setStore(saveNotes(problem.id, notes));
  };

  // Render math in text — replace $...$ with InlineMath, $$...$$ with BlockMath
  const renderMath = (text: string) => {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        try { return <BlockMath key={i} math={part.slice(2, -2)} />; } catch { return <span key={i}>{part}</span>; }
      }
      if (part.startsWith("$") && part.endsWith("$")) {
        try { return <InlineMath key={i} math={part.slice(1, -1)} />; } catch { return <span key={i}>{part}</span>; }
      }
      return <span key={i}>{part}</span>;
    });
  };

  const idx = PROBLEMS.findIndex(p => p.id === id);
  const prev = idx > 0 ? PROBLEMS[idx - 1] : null;
  const next = idx < PROBLEMS.length - 1 ? PROBLEMS[idx + 1] : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link to="/problems">
          <span
            className="flex items-center gap-1 text-sm cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={14} /> Problems
          </span>
        </Link>
        <span style={{ color: "var(--border)" }}>/</span>
        <span className="text-sm" style={{ color: "var(--text)" }}>{problem.title}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Left: Problem Content */}
        <div className="space-y-5">
          {/* Header */}
          <div
            className="rounded-xl border p-6"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: `${diffColors[problem.difficulty]}18`,
                      color: diffColors[problem.difficulty],
                    }}
                  >
                    {problem.difficulty}
                  </span>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                  >
                    {problem.category}
                  </span>
                  {progress?.solved && (
                    <span
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                      style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                    >
                      <CheckCircle size={11} /> Solved
                    </span>
                  )}
                </div>
                <h1
                  className="text-2xl font-bold"
                  style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
                >
                  {problem.title}
                </h1>
                {problem.source && (
                  <p className="text-xs mt-1 font-mono" style={{ color: "var(--text-muted)" }}>
                    {problem.source}
                  </p>
                )}
              </div>
              <button
                onClick={handleBookmark}
                className="p-2 rounded-lg border transition-colors"
                style={{
                  borderColor: "var(--border)",
                  color: progress?.bookmarked ? "var(--accent)" : "var(--text-muted)",
                  background: progress?.bookmarked ? "var(--accent-light)" : "transparent",
                }}
              >
                {progress?.bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {problem.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: "var(--tag-bg)", color: "var(--tag-text)" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Statement */}
            <div
              className="p-4 rounded-lg text-sm leading-relaxed"
              style={{ background: "var(--surface-2)", color: "var(--text)" }}
            >
              {renderMath(problem.statement)}
            </div>
          </div>

          {/* Hints */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
              <Lightbulb size={15} style={{ color: "var(--accent)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Hints
              </span>
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full"
                style={{ background: "var(--accent-light)", color: "var(--accent)" }}
              >
                {problem.hints.length} hints
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {problem.hints.map((hint, i) => (
                <div key={i}>
                  <button
                    className="w-full flex items-center justify-between px-5 py-3 text-sm text-left transition-colors hover:bg-[var(--surface-2)]"
                    style={{ color: "var(--text)" }}
                    onClick={() => toggleHint(i)}
                  >
                    <span className="font-medium">Hint {i + 1}</span>
                    {hintsOpen.includes(i) ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                  {hintsOpen.includes(i) && (
                    <div
                      className="px-5 pb-4 text-sm leading-relaxed"
                      style={{ color: "var(--text-muted)", background: "var(--accent-light)" }}
                    >
                      {renderMath(hint)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mark Solved */}
          {!progress?.solved && (
            <button
              onClick={handleSolved}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: "var(--accent)" }}
            >
              <CheckCircle size={16} />
              Mark as Solved
            </button>
          )}

          {/* Solution */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: "var(--surface)", borderColor: progress?.solved ? "var(--accent)" : "var(--border)" }}
          >
            <button
              className="w-full flex items-center justify-between px-5 py-3 border-b transition-colors hover:bg-[var(--surface-2)]"
              style={{ borderColor: "var(--border)" }}
              onClick={() => setSolutionOpen(!solutionOpen)}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={15} style={{ color: "var(--accent)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Full Solution
                </span>
              </div>
              {solutionOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {solutionOpen && (
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                    Answer
                  </p>
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ background: "var(--accent-light)", borderLeft: "3px solid var(--accent)" }}
                  >
                    {(() => {
                      try {
                        return <BlockMath math={problem.answer} />;
                      } catch {
                        return <span className="text-sm font-mono" style={{ color: "var(--text)" }}>{problem.answer}</span>;
                      }
                    })()}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                    Explanation
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                    {renderMath(problem.solutionExplanation)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <button
              className="w-full flex items-center justify-between px-5 py-3 border-b"
              style={{ borderColor: "var(--border)" }}
              onClick={() => setNotesOpen(!notesOpen)}
            >
              <div className="flex items-center gap-2">
                <StickyNote size={15} style={{ color: "var(--text-muted)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  My Notes
                </span>
              </div>
              {notesOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {notesOpen && (
              <div className="p-4">
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Jot down your approach, insights, or questions…"
                  rows={5}
                  className="w-full text-sm p-3 rounded-lg border outline-none resize-none"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-2)",
                    color: "var(--text)",
                    fontFamily: "Poppins, sans-serif",
                  }}
                />
                <button
                  onClick={handleSaveNotes}
                  className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: "var(--accent)" }}
                >
                  Save Notes
                </button>
              </div>
            )}
          </div>

          {/* Prev/Next */}
          <div className="flex justify-between gap-3 pt-2">
            {prev ? (
              <Link to={`/problems/${prev.id}`}>
                <span
                  className="flex items-center gap-1 text-xs font-medium cursor-pointer px-3 py-2 rounded-lg border transition-colors hover:bg-[var(--accent-light)]"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  <ArrowLeft size={12} /> {prev.title}
                </span>
              </Link>
            ) : <div />}
            {next && (
              <Link to={`/problems/${next.id}`}>
                <span
                  className="flex items-center gap-1 text-xs font-medium cursor-pointer px-3 py-2 rounded-lg border transition-colors hover:bg-[var(--accent-light)]"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  {next.title} →
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Right: Simulation */}
        <div className="lg:sticky lg:top-20 self-start">
          <SimulationPanel problem={problem} onSolved={handleSolved} />
        </div>
      </div>
    </div>
  );
}
