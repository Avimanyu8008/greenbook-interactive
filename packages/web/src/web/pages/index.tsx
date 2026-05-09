import { Link } from "wouter";
import { ArrowRight, BookOpen, Cpu, BarChart2, Trophy, Zap, Brain, Target, ListChecks, FileText } from "lucide-react";
import { PROBLEMS, CATEGORIES } from "../data/problems";
import { loadProgress, getStats } from "../lib/progress";

export default function HomePage() {
  const store = loadProgress();
  const stats = getStats(store, PROBLEMS.length);

  const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
  PROBLEMS.forEach(p => diffCounts[p.difficulty]++);

  const recentProblems = PROBLEMS.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{ background: "var(--accent-light)", color: "var(--accent)", border: "1px solid rgba(74,222,128,0.2)" }}
          >
            <Zap size={11} />
            Inspired by Xinfeng Zhou's Green Book
          </div>

          <h1
            className="text-5xl md:text-6xl font-bold leading-tight mb-5"
            style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)", maxWidth: 620 }}
          >
            Master Probability for{" "}
            <span style={{ color: "var(--accent)" }}>Quant Interviews</span>
          </h1>

          <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "var(--text-muted)" }}>
            Interactive simulations, Monte Carlo engines, and visual proofs for the
            probability problems asked at Jane Street, Citadel, Two Sigma, and beyond.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/problems">
              <span
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: "var(--accent)" }}
              >
                Start Solving <ArrowRight size={15} />
              </span>
            </Link>
            <Link to="/drill">
              <span
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border transition-colors hover:bg-[var(--accent-light)]"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              >
                <Brain size={15} />
                Mental Math Drill
              </span>
            </Link>
            <Link to="/interview">
              <span
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border transition-colors hover:bg-[var(--accent-light)]"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              >
                <Target size={15} />
                Interview Mode
              </span>
            </Link>
          </div>
        </div>

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(rgba(74,222,128,0.4) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </section>

      {/* Stats Bar */}
      <section
        className="border-b"
        style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Problems", value: PROBLEMS.length, icon: BookOpen },
            { label: "Solved", value: `${stats.solved}/${PROBLEMS.length}`, icon: Trophy },
            { label: "Categories", value: CATEGORIES.length - 1, icon: BarChart2 },
            { label: "Current Streak", value: `${stats.streak} days`, icon: Zap },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--accent-light)" }}
              >
                <Icon size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <div className="text-lg font-bold" style={{ color: "var(--text)", fontFamily: "JetBrains Mono, monospace" }}>
                  {value}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
        >
          Topic Areas
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Covering the full spectrum of probability theory used in quant interviews
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.filter(c => c !== "All").map(cat => {
            const count = PROBLEMS.filter(p => p.category === cat).length;
            const solved = PROBLEMS.filter(p => p.category === cat && store.problems[p.id]?.solved).length;
            return (
              <Link key={cat} to={`/problems?category=${encodeURIComponent(cat)}`}>
                <div
                  className="p-4 rounded-xl border cursor-pointer transition-all hover:border-[var(--accent)] group"
                  style={{ background: "var(--glass-bg)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderColor: "var(--glass-border)", boxShadow: "var(--glass-shadow)" }}
                >
                  <div className="text-sm font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors" style={{ color: "var(--text)" }}>
                    {cat}
                  </div>
                  <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                    {count} problem{count !== 1 ? "s" : ""}
                  </div>
                  {count > 0 && (
                    <div className="w-full h-1 rounded-full" style={{ background: "var(--border)" }}>
                      <div
                        className="h-1 rounded-full transition-all"
                        style={{ width: `${(solved / count) * 100}%`, background: "var(--accent)" }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Problems */}
      <section
        className="border-t"
        style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
            >
              Start Here
            </h2>
            <Link to="/problems">
              <span
                className="flex items-center gap-1 text-sm font-medium cursor-pointer"
                style={{ color: "var(--accent)" }}
              >
                All problems <ArrowRight size={14} />
              </span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {recentProblems.map(problem => {
              const prog = store.problems[problem.id];
              const diffColor = { Easy: "var(--easy)", Medium: "var(--medium)", Hard: "var(--hard)" }[problem.difficulty];
              return (
                <Link key={problem.id} to={`/problems/${problem.id}`}>
                  <div
                    className="p-5 rounded-xl border cursor-pointer transition-all hover:border-[var(--accent)] group"
                    style={{
                      background: "var(--glass-bg)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      borderColor: prog?.solved ? "var(--accent)" : "var(--glass-border)",
                      boxShadow: "var(--glass-shadow)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        className="font-semibold text-sm group-hover:text-[var(--accent)] transition-colors"
                        style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
                      >
                        {problem.title}
                      </h3>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                        style={{ background: `${diffColor}18`, color: diffColor }}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-xs line-clamp-2 mb-3" style={{ color: "var(--text-muted)" }}>
                      {problem.statement.slice(0, 110)}…
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        {problem.source}
                      </span>
                      <span className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
                        {prog?.solved ? "✓ Solved" : "Solve →"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
        >
          Everything You Need
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Built for serious quant interview prep
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Brain, label: "Mental Math Drill", desc: "Timed arithmetic drills", to: "/drill", color: "#eff6ff", accent: "#1d4ed8" },
            { icon: Target, label: "Interview Mode", desc: "Simulated timed sessions", to: "/interview", color: "#fdf4ff", accent: "#9333ea" },
            { icon: ListChecks, label: "Playlists", desc: "Curated study paths", to: "/playlists", color: "#f0fdf4", accent: "#16a34a" },
            { icon: FileText, label: "Cheat Sheet", desc: "All key formulas", to: "/cheatsheet", color: "#fefce8", accent: "#ca8a04" },
          ].map(({ icon: Icon, label, desc, to, color, accent }) => (
            <Link key={to} to={to}>
              <div
                className="p-4 rounded-xl cursor-pointer transition-all group"
                style={{ background: "var(--glass-bg)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${accent}25`, boxShadow: "var(--glass-shadow)" }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${accent}15` }}
                >
                  <Icon size={18} style={{ color: accent }} />
                </div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>{label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
        >
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: "Read the Problem",
              desc: "Each problem comes with the exact statement, hints, and the mathematical setup used in quant interviews.",
            },
            {
              icon: Cpu,
              title: "Run the Simulation",
              desc: "Adjust parameters and run Monte Carlo simulations instantly. Watch probabilities converge in real time.",
            },
            {
              icon: BarChart2,
              title: "Understand the Solution",
              desc: "View the full mathematical solution with KaTeX-rendered formulas, intuition, and visual proofs.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--glass-bg)", backdropFilter: "blur(8px)", border: "1px solid var(--glass-border)" }}
              >
                <Icon size={22} style={{ color: "var(--accent)" }} />
              </div>
              <h3
                className="font-semibold mb-2 text-base"
                style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
